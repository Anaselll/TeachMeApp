import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import TagsDropdown from "../components/TagsDropdown";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

// These would be your separate components for each section

const BasicInfo = ({ formData, setFormData, role }) => {
  const verse = role === "tutor" ? "student" : "tutor";
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="font-semibold text-gray-800">
          You are a <span className="font-bold text-blue-600">{role}</span> and
          you need to make an offer to a {verse}.
        </p>
      </div>

      <div className="flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">Subject:</label>
        <input
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          type="text"
          name="subject"
          placeholder="Enter the subject"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          required
        />
      </div>

      <div className="flex flex-col mt-4">
        <label className="font-semibold text-gray-700 mb-2">Description:</label>
        <textarea
          value={formData.description}
          name="description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter the description"
          className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm min-h-40 resize-y"
          required
        ></textarea>
      </div>
    </div>
  );
};

const PricingSchedule = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label className="font-semibold">Price:</label>
        <input
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          type="number"
          name="price"
          placeholder="Enter the price"
          className="border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="font-semibold">Date:</label>
        <input
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          type="datetime-local"
          name="date"
          className="border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="font-semibold">Duration (hours):</label>
        <input
          value={formData.dure}
          onChange={(e) => setFormData({ ...formData, dure: e.target.value })}
          type="number"
          name="dure"
          placeholder="Enter the duration in hours"
          className="border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>
    </div>
  );
};

const Classification = ({
  formData,
  setFormData,
  categories,
  handleCategoryChange,
  availableTags,
  selectedTags,
  handleTagsChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label className="font-semibold">Category:</label>
        <select
          value={formData.category}
          onChange={handleCategoryChange}
          name="category"
          className="border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-semibold">Tags:</label>
        <TagsDropdown
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          disabled={!formData.category}
        />
      </div>
    </div>
  );
};

export default function CreateOffer() {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const { offer_type } = useParams();
  const role=offer_type==="find_student"?"tutor":"student"

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    price: "",
    category: "",
    date: "",
    dure: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFormData({ ...formData, category: categoryId });
    setSelectedTags([]);

    if (!categoryId) {
      setAvailableTags([]);
      return;
    }

    // Find the selected category
    const category = categories.find((cat) => cat._id === categoryId);

    if (category) {
      // Convert tags to the format expected by TagsDropdown
      const tags_data = category.tags.map((tag, index) => ({
        title: tag,
        objectID: `tag-${index}`, // Generate unique objectID
      }));
      setAvailableTags(tags_data);
    }
  };

  const handleTagsChange = (updatedTags) => {
    setSelectedTags(updatedTags);
  };

  const handleSubmit = async () => {
    try {
      const datenow = new Date();
      const dateform = new Date(formData.date);

      if (datenow.getTime() >= dateform.getTime()) {
        toast.error("You have to choose a future date");
        return;
      }

      // Extract tag titles for API
      const tagTitles = selectedTags.map((tag) => tag.title);

      const offerData = {
        ...formData,
        tags: tagTitles,
        offer_type: offer_type === "find_tutor" ? "find_student" : "find_tutor",
        creator_id: user._id,
      };

      await axiosInstance.post("/offers/create", offerData);
      navigate(`/offers/${offer_type}`);
    } catch (error) {
      console.error("Error submitting offer:", error);
    }
  };

  const steps = [
    {
      title: "Basic Information",
      items: [
        {
          label: "Subject & Description",
          componentKey: "basic",
        },
      ],
    },
    {
      title: "Pricing & Scheduling",
      items: [
        {
          label: "Price & Date",
          componentKey: "pricing",
        },
      ],
    },
    {
      title: "Classification",
      items: [
        {
          label: "Category & Tags",
          componentKey: "classification",
        },
      ],
    },
  ];

  const [activeStep, setActiveStep] = useState(steps[0].items[0]);

  const renderActiveComponent = () => {
    switch (activeStep.componentKey) {
      case "basic":
        return <BasicInfo formData={formData} setFormData={setFormData} role={role}/>;
      case "pricing":
        return (
          <PricingSchedule formData={formData} setFormData={setFormData} />
        );
      case "classification":
        return (
          <Classification
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            handleCategoryChange={handleCategoryChange}
            availableTags={availableTags}
            selectedTags={selectedTags}
            handleTagsChange={handleTagsChange}
          />
        );
      default:
        return <BasicInfo formData={formData} setFormData={setFormData} />;
    }
  };

  return (
    <div className="grid grid-cols-[30%_70%] h-screen bg-gradient-to-b from-[#868ddb] to-[#252644]">
      <div className="bg-gray-100 h-full p-6">
        <h1 className="text-2xl font-bold mb-6">Create your offer</h1>

        {steps.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li
                  key={`${sectionIndex}-${itemIndex}`}
                  className={`cursor-pointer p-2 ${
                    activeStep.label === item.label
                      ? "border-l-2 border-[#A7E629] text-black font-semibold bg-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveStep(item)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-40 h-10 font-bold rounded-xl bg-[#A7E629]"
        >
          Submit your offer
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
