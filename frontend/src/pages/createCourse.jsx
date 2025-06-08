import { useContext, useState } from "react";
import { First,Second,Third,Fourth,Seventh,Eighth} from "../components/createCourse";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export default function CreateCourse() {
  const {user}=useContext(AuthContext)
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    tutor: user._id,
    thumbnail:"",
    price: 0,
    level: "Beginner",
    discount:"0%",
    requirements: [],
    language: "English",

   
    curriculum: [],
  });

  const steps = [
    {
      title: "Plan your course",
      items: [
        {
          label: "Course title & description",
          componentKey: "first",
        },
        {
          label: "Choose category & tags",
          componentKey: "second",
        },
        {
          label: "Define target audience",
          componentKey: "third",
        },
      ],
    },
    {
      title: "Create your content",
      items: [
        {
          label: "Course curriculum",
          componentKey: "fourth",
        },
     
      
      ],
    },
    {
      title: "Publish your course",
      items: [
        {
          label: "Set course price",
          componentKey: "Seventhth",
        },
        {
          label: "Course landing page ",
          componentKey: "Eighthh",
        },
      
      ],
    },
  ];

  const [activeStep, setActiveStep] = useState(steps[0].items[0]);
const handleSubmit=async()=>{
  await axiosInstance.post(`/courses/create`,course).then(()=>{
    toast.success("Course created successfully");
    window.location.reload();
  })
  console.log(course)
 
}
  const renderActiveComponent = () => {
    switch (activeStep.componentKey) {
      case "first":
        return <First course={course} setCourse={setCourse} />;
      case "second":
        return <Second course={course} setCourse={setCourse} />;
      case "third":
        return <Third course={course} setCourse={setCourse} />;
      case "fourth":
        return <Fourth course={course} setCourse={setCourse} />;

      case "Seventhth":
        return <Seventh course={course} setCourse={setCourse} />;
      case "Eighthh":
        return <Eighth course={course} setCourse={setCourse} />;
     
      default:
        return <First course={course} setCourse={setCourse} />;
    }
  };

  return (
    <div className="grid grid-cols-[30%_70%] h-screen">
      <div className="bg-gray-100 h-full p-6">
        {steps.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li
                  key={`${sectionIndex}-${itemIndex}`}
                  className={`cursor-pointer p-2 ${
                    activeStep.label === item.label
                      ? "border-l-2 text-black font-semibold"
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
        <button onClick={handleSubmit} className="w-40 h-10 font-bold rounded-xl bg-[#A7E629]">
          Submit your course
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
