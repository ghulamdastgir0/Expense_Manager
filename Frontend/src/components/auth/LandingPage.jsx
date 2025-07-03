import React from "react";
import heroImg from "../../assets/investment.png";
import aboutImg from "../../assets/money.svg";
import contactImg from "../../assets/contact.svg";
import img1 from "../../assets/pic1.png";
import img2 from "../../assets/pic2.png";
import img3 from "../../assets/pic3.png";
import {useNavigate} from "react-router-dom";

const LandingPage = () => {
  const navigate= useNavigate();

  return (
    <div className="scroll-smooth font-sans overflow-x-hidden bg-[#2D5A4A] text-white">
      {/* Mobile Top Logo */}
      <div className="block md:hidden w-full text-center py-4 bg-black fixed top-0 left-0 z-50 shadow-md">
        <h1 className="font-bold text-lg text-green-700">
          ExpenseTracker<span className="text-[10px] align-super">™</span>
        </h1>
      </div>

      {/* Desktop Navbar */}
      <header className="hidden md:block w-full bg-black shadow-md fixed top-0 left-0 z-50">
        <div className="flex justify-between items-center px-10 lg:px-20 py-4">
          <h1 className="font-bold text-lg text-green-700">
            ExpenseTracker<span className="text-[10px] align-super">™</span>
          </h1>
          <div className="flex gap-4">
            <button onClick={() => navigate('/signin')} className="text-white bg-[#539165] px-4 py-2 rounded-md hover:bg-[#407c4e] hover:scale-110 transition text-sm">
              Sign In
            </button>
            <button onClick={() => navigate('/signup')} className="text-[#539165] border border-[#539165] bg-black px-4 py-2 rounded-md hover:bg-[#1a1a1a] transition text-sm">
             Sign Up
            </button>

          </div>
        </div>
      </header>

      <main className="pt-20 md:pt-32 w-full">
        {/* Hero Section */}
        <section className="w-full px-5 md:px-10 lg:px-20 py-10 flex flex-col md:flex-row items-center">
          <div className="md:w-2/4 text-center md:text-left space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
              Take Control of Your <span className="text-brightGreen">Finances</span>
            </h2>
            
            <p className="text-lightText">
              ExpenseTracker™ helps you effortlessly track your daily expenses, set personalized budgets, and gain meaningful
               insights into your spending habits—all from one intuitive platform. Whether you're saving for a goal, reducing debt, 
               or simply want more control over your finances, ExpenseTracker™ gives you the tools you need to stay on top of your money and build a financially secure future.
            </p>

            {/* Mobile: Login & Sign Up Buttons */}
            <div className="flex md:hidden justify-center gap-3 mt-4 py-10">
              <button className="bg-[#539165] text-white px-4 py-2  rounded-md text-sm">
                Login
              </button>
             <button className="text-[#539165] border border-[#539165] bg-black px-4 py-2 rounded-md hover:bg-[#1a1a1a] transition text-sm">
                Sign Up
                </button>

            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full md:w-2/4  ">
            <img src={heroImg} alt="Hero" className="w-full max-w-[500px] mx-auto" />
          </div>
        </section>

            <hr className="text-black"></hr>

        {/* About Section */}
        <section className="w-full px-5 md:px-10 lg:px-20 py-10 flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="w-full md:w-2/4">
            <img src={aboutImg} alt="About" className="w-full max-w-[500px] mx-auto" />
          </div>
          <div className="w-full md:w-2/4 text-center md:text-left space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why <span className="text-brightGreen">ExpenseTracker™?</span>
            </h2>
            <p className="text-lightText">
              Managing money can be tough. That's why we built a simple yet powerful platform
              that helps you track expenses, set saving goals, and stay on top of your
              financial life with ease.
            </p>
          </div>
        </section>

            <hr className="text-black"></hr>


        {/* Reviews Section */}
        <section className="w-full px-5 md:px-10 lg:px-20 py-10 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
            What Our <span className="text-brightGreen">Users Say</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {[
              { img: img1, name: "Ayesha", review: "Budgeting made easy! All because of ExpenseTracker™" },
              { img: img2, name: "Ali", review: "Clean UI and powerful tracking features." },
              { img: img3, name: "Sara", review: "Helped me save $15,000 in 3 months!" },
            ].map((user, i) => (
              <div
                key={i}
                className="w-full max-w-[300px] bg-[#b0f7c8] text-black p-6 rounded-xl shadow-md text-center"
              >
                <img
                  src={user.img}
                  alt={`user-${i}`}
                  className="w-24 h-24 mx-auto rounded-full mb-4"
                />
                <p className="italic text-gray-700">"{user.review}"</p>
                <h4 className="font-bold mt-2">{user.name}</h4>
              </div>
            ))}
          </div>
        </section>

                    <hr className="text-black"></hr>


        {/* Contact Section */}
        <section className="w-full px-5 md:px-10 lg:px-20 py-10 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
            Stay <span className="text-brightGreen">Connected</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-between w-full gap-10 mt-10">
            <form className="w-full md:w-2/5 space-y-5">
              {["Full Name", "Email Address", "Phone Number","Message"].map((label, i) => {
                const id = label.toLowerCase().replace(/\s/g, "");
                const type = label.includes("Email") ? "email" : "text";
                return (
                  <div key={i} className="flex flex-col">
                    <label htmlFor={id}>{label}</label>
                    <input
                      type={type}
                      id={id}
                      name={id}
                      placeholder={`Enter ${label}`}
                      className="py-3 px-3 rounded-lg hover:shadow-md bg-black text-white"
                    />
                  </div>
                );
              })}
              <div className="flex justify-center">
                <button className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 hover:scale-110 transition-all">
                  Send Message
                </button>
              </div>
            </form>
            <div className="w-full md:w-2/4">
              <img src={contactImg} alt="Contact" className="w-full max-w-[500px] mx-auto" />
            </div>
          </div>
           
            <hr className="text-black"></hr>


        </section>
        <footer className="py-4">
            
            <p className="text-center mt-6 text-lg mb-2">
          © 2025 <span className="text-brightGreen font-semibold">ExpenseTracker™</span> | All rights reserved
        </p>
        </footer>
      </main>

    </div>
  );
};

export default LandingPage