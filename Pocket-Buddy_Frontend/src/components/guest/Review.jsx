import React from "react";
import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/pic2.png";
import img3 from "../../assets/img/pic3.png";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Review = () => {
  const reviews = [
    {
      img: img1,
      name: "Sophia Azura",
      review: "Pocket Buddy helped me discover amazing deals nearby! It's easy to use and saves me a lot every month.",
    },
    {
      img: img2,
      name: "John Deo",
      review: "As a foodie, finding the best offers has never been this simple. I absolutely recommend Pocket Buddy!",
    },
    {
      img: img3,
      name: "Victoria Zoe",
      review: "The subscription is totally worth it. I get exclusive deals that I can't find anywhere else!",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center md:px-32 px-6 bg-gray-50">
        <h1 className="text-4xl font-bold text-center lg:pt-20 pt-28 pb-6">
          What Our Customers Say
        </h1>
        <p className="text-center max-w-2xl text-gray-600 mb-10">
          Pocket Buddy users are loving how easy it is to find and redeem the best restaurant offers. Here's what they have to say!
        </p>

        <div className="flex flex-col md:flex-row gap-8 mb-20">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl p-6 flex flex-col items-center max-w-xs"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 text-center text-sm">{item.review}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Review;
