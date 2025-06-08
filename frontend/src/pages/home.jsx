import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import Hero from "../components/hero";
import Student from "../assets/student.png";
import Tutor from "../assets/tutor.png";
import human from "../assets/s.png";
import smile from "../assets/smile.svg";
import { axiosInstance } from "../lib/axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [top5Courses, setTop5Courses] = useState([]);

  useEffect(() => {
    const fetchTop5Courses = async () => {
      try {
        const response = await axiosInstance.get("/courses/top5");
        setTop5Courses(response.data);
        console.log("Top 5 courses:", response.data);
      } catch (error) {
        console.error("Error fetching top 5 courses:", error);
        return [];
      }
    };
    fetchTop5Courses();
  }, []);

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#868ddb] to-[#252644]">
        <div className="pb-64 md:pb-80">
          <Hero />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 absolute bottom-0 w-full">
          <div className="flex justify-center items-center flex-col gap-y-10 mb-35">
            <div className="flex justify-center items-center gap-x-3">
              <img
                width="50"
                height="50"
                src={smile}
                className="hover:scale-110 transition-transform duration-300"
                alt="Smile"
              />
              <p className="text-white font-medium"> Happy Students!!</p>
            </div>
            <p className="w-50 text-white text-center px-4">
              "Explore unlimited offers for students looking for tutors."
            </p>
          </div>

          <div className="flex justify-center ">
            <img
              width="350"
              height="350"
              src={human}
              className="drop-shadow-2xl"
              alt="Person"
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-y-10 mb-35">
            <div className="flex justify-center items-center gap-x-3">
              <img
                width="50"
                height="50"
                src={smile}
                className="hover:scale-110 transition-transform duration-300"
                alt="Smile"
              />
              <p className="text-white font-medium"> Happy Tutors!!</p>
            </div>
            <p className="w-50 text-white text-center px-4">
              "Explore unlimited offers for tutors looking for students."
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 px-6 w-full bg-gradient-to-b from-[#252644] to-[#191A2C]">
        <h1 className="text-center text-white font-bold text-3xl md:text-4xl mb-12">
          Start with Us
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 w-full">
          <Link
            to="/offers/find_tutor"
            className="transition-transform duration-300 hover:scale-105"
          >
            <FeatureCard
              title="I'm a Student"
              description="Looking for tutors offers??"
              image={Student}
              bgColor="bg-[#6366F1] border-dashed border-2 border-[#A7E629]"
            />
          </Link>
          <Link
            to="/offers/find_student"
            className="transition-transform duration-300 hover:scale-105"
          >
            <FeatureCard
              title="I'm a Tutor"
              description="Looking for students offers??"
              image={Tutor}
              bgColor="bg-[#A7E629] border-dashed border-2 border-[#6366F1]"
            />
          </Link>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#191A2C] ">
        <div className="text-center mb-12">
          <h2 className="text-white font-bold text-3xl md:text-4xl">
            How It Works
          </h2>
          <p className="text-gray-300 mt-2 max-w-xl mx-auto">
            Connect with tutors or students in just a few simple steps
          </p>
        </div>

        <div className="grid relative grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {["Create Your Profile", "Browse Offers", "Connect & Learn"].map(
            (title, index) => (
              <div
                key={index}
                className="bg-[#2A2C42] p-6 rounded-xl relative transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="bg-[#A7E629] w-12 h-12 rounded-full flex items-center justify-center text-[#191A2C] font-bold text-xl mb-4">
                  {index + 1}
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
                <p className="text-gray-300">
                  {index === 0 &&
                    "Sign up and build your profile highlighting your needs or expertise."}
                  {index === 1 &&
                    "Explore available tutoring offers or post your own teaching opportunity."}
                  {index === 2 &&
                    "Schedule sessions and start your personalized learning journey."}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19"
                        stroke="#A7E629"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 5L19 12L12 19"
                        stroke="#A7E629"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </section>

      <section className="relative py-24 px-6 w-full bg-[#191A2C]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-white font-extrabold text-4xl mb-4 leading-tight">
            Start Your Learning Journey With Us
          </h1>
          <p className="text-gray-300 text-lg">
            Explore a curated selection of high-quality courses recommended just
            for you. Whether you're beginning your educational journey or
            looking to sharpen existing skills, we've got something valuable
            waiting for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {top5Courses.map((course) => (
            <div
              key={course._id}
              className="bg-[#2A2C42] rounded-2xl overflow-hidden shadow-lg flex flex-col hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-44 object-cover"
              />

              <div className="p-4 flex flex-col justify-between h-full">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">
                    ⭐ {course.rating || 0} / 5
                  </span>
                  <span className="text-sm text-green-400 font-medium">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/courses"
            className="inline-block bg-[#A7E629] text-[#191A2C] font-bold px-6 py-3 rounded-xl hover:bg-[#c7fc4e] transition-colors duration-300"
          >
            See All Courses
          </Link>
        </div>
      </section>
    </>
  );
}
