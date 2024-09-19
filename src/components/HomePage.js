import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    EmailShareButton,
    RedditShareButton,
    TelegramShareButton,
    PinterestShareButton,
} from 'react-share';
import {
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
    EmailIcon,
    RedditIcon,
    TelegramIcon,
    PinterestIcon,
} from 'react-share';
import { alignPropType } from 'react-bootstrap/esm/types';
import { alignProperty } from '@mui/material/styles/cssUtils';

function ShareProduct({ category, title, description }) {
    const shareUrl = window.location.href; // Get the current URL
    const [showShareOptions, setShowShareOptions] = useState(false);

    const handleShareClick = () => {
        setShowShareOptions(!showShareOptions);
    };

    const handleShareOnPlatform = (platform) => {
        console.log(`Sharing on ${platform}`);
        setShowShareOptions(false);
    };

    const shareOptions = [
        { platform: 'Facebook', Icon: FacebookIcon },
        { platform: 'Twitter', Icon: TwitterIcon },
        { platform: 'WhatsApp', Icon: WhatsappIcon },
        { platform: 'LinkedIn', Icon: LinkedinIcon },
        { platform: 'Email', Icon: EmailIcon },
        { platform: 'Reddit', Icon: RedditIcon },
        { platform: 'Telegram', Icon: TelegramIcon },
        { platform: 'Pinterest', Icon: PinterestIcon },
    ];

    return (
        <div className="d-flex justify-content-end mt-3 position-relative">
            <button className="btn btn-primary" onClick={handleShareClick}>
                Share
            </button>
            {showShareOptions && (
                <div className="dropdown-menu show">
                    {shareOptions.map((option, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleShareOnPlatform(option.platform)}
                        >
                            <option.Icon size={24} round />
                            {option.platform}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const culturalCategories = [
  {
      title: 'Oromo Cultural Clothes',
      options: [
          { name: 'Wolega Dress', image: 'https://i.pinimg.com/originals/79/7c/a6/797ca602777de5eb7732a7ecdfd3df21.jpg' },
          { name: 'Jimma Dress', image: 'https://th.bing.com/th/id/OIP.JwyljbqseDlJjhT6tDgOmwHaLG?rs=1&pid=ImgDetMain' },
          { name: 'Harar Dress', image: 'https://i.pinimg.com/originals/1b/73/df/1b73df52fcf120a4b209dae4083a61ef.jpg' },
          { name: 'Shewa Dress', image: 'https://th.bing.com/th/id/OIP.enM2nyjtFkEwuqcheHIGxgHaHa?w=1440&h=1440&rs=1&pid=ImgDetMain' },
          { name: 'Arsi Dress', image: 'https://i.pinimg.com/originals/79/7c/a6/797ca602777de5eb7732a7ecdfd3df21.jpg' },
          { name: 'Guji Dress', image: 'https://via.placeholder.com/150' },
          { name: 'Oromo Apparels', image: 'https://via.placeholder.com/150' },
      ],
  },
  {
      title: 'Amhara',
      options: [
          { name: 'Gonder Dress', image:'https://th.bing.com/th/id/R.52e5878b1db200339154d9cbc2b1d1ff?rik=7MJfq32kPyj2VQ&pid=ImgRaw&r=0'},
          { name: 'Gojam Dress', image: 'https://i.pinimg.com/736x/4c/b1/70/4cb1705cf7bd04c2d3b846ff6777768d.jpg' },
          { name: 'Wello Dress', image: 'https://i.pinimg.com/736x/2c/88/5b/2c885b028aee88d0ae4b2554e9712d88.jpg' },
          { name: 'Shewa Dress', image: 'https://via.placeholder.com/150' },
          { name: 'Amhara Apparels', image: 'https://via.placeholder.com/150' },
      ],
  },
  {
      title: 'Tigre',
      options: [
          { name: 'Raya Dress', image: 'https://i.pinimg.com/originals/de/e5/5b/dee55ba90a06f124a1511d1f7ea3b4f7.jpg' },
          { name: 'Adigrat Dress', image: 'https://th.bing.com/th/id/OIP.tj9_m0Za74AmUKoPsDc4iQAAAA?rs=1&pid=ImgDetMain' },
          { name: 'Axum Dress', image: 'https://i.pinimg.com/736x/84/8e/9d/848e9d9ee0de3b0960ffb54e45fdc85d.jpg' },
          { name: 'Shire Dress', image: 'https://i.pinimg.com/736x/97/65/da/9765daad9dbfd6f66b6994680bff9e43.jpg' },
          { name: 'Tigre Apparels', image: 'https://via.placeholder.com/150' },
      ],
  },
  {
      title: 'Debub',
      options: [
          { name: 'Gurage Dress', image: 'https://i.pinimg.com/736x/f6/05/7c/f6057c7cf650315c3d949293f18db1af--africa.jpg' },
          { name: 'Sidama Dress', image: 'https://via.placeholder.com/150' },
          { name: 'Wolayta Dress', image: 'https://i.pinimg.com/originals/c2/b4/19/c2b4191702c12355da8b8a7782e58fec.jpg' },
          { name: 'Debub Apparels', image: 'https://i.pinimg.com/originals/07/fb/6a/07fb6a1b34d12dd2ed79b268a7ddebbe.jpg' },
      ],
  },
];

const newsData = [
    {
        id: 1,
        title: 'New Collection Launch!',
        description: 'Check out our latest collection of Cultural CLoths dresses.',
    },
    {
        id: 2,
        title: 'Special Discount Offer!',
        description: 'Get 20% off on all cultural clothes this week.',
    },
    {
        id: 3,
        title: 'Limited Items!',
        description: 'Explore our exclusive range of limited edition apparels.',
    },
];

function HomePage() {
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const handleOrderClick = (category) => {
      navigate('/order', { state: { category } });
  };

  const handleShare = (category) => {
      const currentUrl = window.location.href;
      const shareMessage = `Check out this "${category.name}" product from Ethio Traditions! ${currentUrl}, ${category.image}`;
      setSelectedImage(category.image);

      if (navigator.share) {
          navigator.share({
              title: category.name,
              text: shareMessage,
              url: currentUrl,
          })
              .then(() => {
                  console.log('Shared successfully!');
              })
              .catch((error) => {
                  console.error('Error sharing:', error);
              });
      } else {
          navigator.clipboard.writeText(shareMessage)
              .then(() => {
                  alert('Share link copied to clipboard!');
              })
              .catch((error) => {
                  console.error('Error copying to clipboard:', error);
              });
      }
  };

  const handleCategoryClick = (category) => {
      setSelectedCategory(category);
      setShowCategoryOptions(true);
  };

  return (
      <div className="container my-5">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
              {/* Navigation bar */}
          </nav>

          {/* Carousel section */}
          <div class="d-flex justify-content-center">
  <Carousel>
    <Carousel.Item>
      <img
        className="d-block"
        style={{ width: '400px', height: '400px' }}
        src="https://th.bing.com/th/id/OIP.wk0QU7gGrEKfzNEHeJRrZAHaHt?rs=1&pid=ImgDetMain"
        alt="First slide"
      />
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block"
        style={{ width: '400px', height: '400px' }}
        src="https://i.pinimg.com/originals/2d/88/09/2d8809070ecfc67724470af0fc4b8fc6.jpg"
        alt="Second slide"
      />
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block"
        style={{ width: '400px', height: '400px' }}
        src="https://i.pinimg.com/originals/29/6c/b3/296cb366e94d8eace35041b59097debe.jpg"
        alt="Third slide"
      />
    </Carousel.Item>
  </Carousel>
</div>

          {/* News section */}
          <div className="row mt-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {newsData.map((newsItem) => (
                  <div key={newsItem.id} className="col-md-4 mb-4" style={{ width: '300px', height: '100px', display: 'flex'}}>
                      <div className="card">
                          <div className="card-body">
                              <h5 className="card-title">{newsItem.title}</h5>
                              <p className="card-text">{newsItem.description}</p>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Cultural categories */}
          <div className="row mt-4" >
              {culturalCategories.map((category, index) => (
                  <div className="col-md-3 mb-4" key={index}>
                      <div className="card h-100">
                          <div className="card-body">
                              <h5 className="card-title">{category.title}</h5>
                              <div className="row">
                                  {category.options.slice(0, 2).map((option, optionIndex) => (
                                      <div className="col-6 mb-3" key={optionIndex}>
                                          <div className="card">
                                              <img src={option.image} className="card-img-top equal-image" alt={option.name} style={{ width: '500', height: '200px'}}/>
                                              <div className="card-body">
                                                  <h6 className="card-title">{option.name}</h6>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                              <button className="btn btn-primary mt-3" onClick={() => handleCategoryClick(category)}>
                                  View All
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Category options */}
          {showCategoryOptions && (
              <div className="row mt-4">
                  <div className="col-12">
                      <h3>{selectedCategory.title}</h3>
                      <div className="row">
                          {selectedCategory.options.map((category, optionIndex) => (
                              <div className="col-md-3 mb-4" key={optionIndex}>
                                  <div className="card">
                                      <img src={category.image} className="card-img-top equal-image" alt={category.name} style={{ width: '500', height: '200px'}} />
                                      <div className="card-body">
                                          <h6 className="card-title">{category.name}</h6>
                                          <div className="card-body d-flex justify-content-between align-items-center">
                                              <button className="btn btn-success mt-4 mr-2" onClick={() => handleOrderClick(category)}>
                                                  Order
                                              </button>
                                              <button className="btn btn-primary mt-4 text-white" onClick={() => handleShare(category)}>
                                                  Share
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
}

export default HomePage;
