import React from "react";
import "./navbar.css";
import barChartImage from "./bar-chart.png";
import romanianFlag from "./romania.png";

export default function NavBar() {
  const currentDate = new Date();

  return (
    <div className="top-nav">
        <div className="top-nav-divs">
      <img src={barChartImage} className="top-nav-img" alt="chart icon" />
      <div className="origin-curr">
      <h1>Origin Currency: RON  </h1>
        <img src={romanianFlag} className="top-nav-img-romania" alt="romanian flag" />
      </div>
      <h3 className="top-nav-date">
        Date: {currentDate.getDate()}-{currentDate.getMonth() + 1}-{currentDate.getFullYear()}
      </h3>
      </div>
    </div>
  );
}



