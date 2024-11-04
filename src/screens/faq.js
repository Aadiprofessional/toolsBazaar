import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskBar from '../components/TaskBar';
import Footer from '../components/Footer';
import "./faq.css";

const FAQScreen = () => {
  const [collapsed, setCollapsed] = useState({});
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get('https://toolsbazaar-server-1036279390366.asia-south1.run.app/faqs');
        setFaq(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        alert('Error: Failed to fetch FAQs. Please try again later.');
      }
    };

    fetchFAQs();
  }, []);

  const toggleCollapse = (index) => {
    setCollapsed(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="faq-screen">
      <TaskBar />
      <div className="faq-container">
      <p className="update-faq-text">Frequently Asked Questions</p>
        {faq.map((faq, index) => (
          <div key={index} className="faq-card">
            <div onClick={() => toggleCollapse(index)} className="faq-header">
              <span className="faq-question">{faq.question}</span>
              <span className="faq-icon">{collapsed[index] ? '-' : '+'}</span>
            </div>
            {collapsed[index] && (
              <div className="faq-body">
                <p className="faq-answer">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
     <Footer/> 
    </div>
  );
};

export default FAQScreen;
