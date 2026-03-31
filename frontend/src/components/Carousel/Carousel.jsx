import './Carousel.css'

function Banner() {
  return (
    <div id="carouselFade" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000"
     >
      <div className="carousel-inner"
      >
        <div className="carousel-item active">
          <img src="/campus_image.webp" className="d-block w-100 carousel-img" alt="img1"
          />
          <div className="carousel-caption mb-0 pb-0" >
            
            <p >One platform. Complete institutional management.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="/college-computerlab.png" className="d-block w-100 carousel-img" alt="img2" />
          <div className="carousel-caption mb-0 pb-0 " >
            
            <p >Seamless fee payment, hostel allocation, and library access. All from one dashboard.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/lecture_hall.jpg" className="d-block w-100 carousel-img" alt="img3" />
          <div className="carousel-caption mb-0 pb-0 " >
            
            <p >Built for scalability, speed, and security. Ready for institutes of any size.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="/college-library.png" className="d-block w-100 carousel-img" alt="img4" />
          <div className="carousel-caption  mb-0 pb-0" >
            
            <p >Empowering institutions through automation, integration, and intelligence.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselFade" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselFade" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Banner;
