import React, { useState } from 'react';
import './Footer.css';
import bottomImage from '../assets/bottom3.png';

const Footer = () => {
    // State to manage modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State to track form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // API call to send data
        console.log(formData);
        
        const response = await fetch('https://toolsbazaar-server-1036279390366.asia-south1.run.app/submitContactUs', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            // Close modal after successful form submission
            setIsModalOpen(false);
        }
    };

    // Function to handle modal close when clicked outside
    const closeModal = (e) => {
        if (e.target.className === 'modal') {
            setIsModalOpen(false);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-bottom">
                <div className="footer-links">
                    <div className="footer-section">
                
                        <div onClick={() => window.location.href = '/about-us'}>About Us</div>
                        <div onClick={() => window.location.href = '/contact-us'}>Contact Us</div>
                        <div onClick={() => window.location.href = '/Blogs'}>Blogs</div>
                    </div>
                    
                    <div className="footer-section">
                        <div onClick={() => window.location.href = '/help'}>Help</div>
                        <div onClick={() => window.location.href = '/faqs'}>FAQs</div>
                
                        <div onClick={() => window.location.href = '/cancellations-returns'}>Cancellations & Returns</div>
                    </div>
                    
                    <div className="footer-section">
                        <div onClick={() => setIsModalOpen(true)}>Connect with us</div>
                        <div>Have a question or want to place an order?</div>
                        <div>
                            Helpline Number:  
                            <a href="tel:+919924686611">+91 9924686611</a>
                        </div>
                        <div>
                            WhatsApp: 
                            <a href="https://wa.me/919924686611">+91 9924686611</a>
                        </div>
                        <div>
                            Mail us:  
                            <a href="mailto:ecomrtepl@gmail.com">ecomrtepl@gmail.com</a>
                        </div>
                        <div>(Mon-Sun: 9am-6pm)</div>
                    </div>
                </div>
            </div>
            <img src={bottomImage} alt="Footer bottom" className="footer-bottom-image" />

            {/* Modal for Contact Form */}
            {isModalOpen && (
    <div className="modal" onClick={closeModal}>
        <div className="modal-content">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="name">Phone</label>
                    <input
                        type="digit"
                        id="Phone"
                        name="phone"
                        placeholder="Enter your name"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                        minLength={10}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div style={{ flexBasis: '100%' }}>
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Enter your message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button className="button2" type="submit">Submit</button>
            </form>
        </div>
    </div>
)}

        </footer>
    );
};

export default Footer;
