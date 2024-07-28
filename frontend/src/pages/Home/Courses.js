import React from "react";
import SectionTitle from "../../components/SectionTitle";
import { useSelector } from "react-redux";

const Course = () => {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const { portfolioData } = useSelector((state) => state.root);
  const { course } = portfolioData || { course: [] }; // Provide a default empty array

  return (
    <div>
      <SectionTitle title="Courses"/>

      <div className="flex py-10 gap-20 sm:flex-col">
        <div className="flex flex-col gap-10 border-l-2 border-[#135e4c82] w-1/3 sm:flex-row sm:overflow-x-scroll sm:w-full">
          {course.map((course, index) => (
            <div
              
              onClick={() => {
                setSelectedItemIndex(index);
              }}
              className="cursor-pointer"
            >
              <h1
                className={`text-xl px-5 ${
                  selectedItemIndex === index
                    ? "text-tertiary border-tertiary border-l-4 -ml-[3px] bg-[#1a7f5a31] py-3"
                    : "text-white"
                }`}
              >
                {course.title}
              </h1>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-10 sm:flex-col">          
          <div className="flex flex-col gap-5">
            <h1 className="text-secondary text-2xl font-semibold">
              {course[selectedItemIndex].title}
            </h1>
            <p className="text-white">
              {course[selectedItemIndex].description}
            </p>
          </div>
          <img
            src={course[selectedItemIndex].image}
            alt={course[selectedItemIndex].title}
            className="h-52 w-80 "
          />
        </div>
      </div>
    </div>
  );
};

export default Course;
