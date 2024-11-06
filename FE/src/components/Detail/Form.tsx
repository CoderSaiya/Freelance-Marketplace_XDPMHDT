import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGavel, faMapMarkerAlt, faClock, faUser, faCheckCircle, faComments, faStar } from '@fortawesome/free-solid-svg-icons';

const ProjectDetailPage: React.FC = () => {
  const renderStars = (rating: number): string => {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return fullStars + emptyStars;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col md:flex-row gap-6">
      {/* Left Column */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:w-3/4">
        {/* Project Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Nghệ sĩ lồng tiếng năng động cho kênh YouTube giáo dục</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span className="bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full mr-2">Mở</span>
              <p>Đã đăng: 1 ngày trước • Kết thúc sau 6 ngày</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-green-500 mb-1">250-750 đô la Mỹ</p>
            <p className="text-gray-500 text-sm">Thanh toán khi giao hàng</p>
          </div>
        </div>

        {/* Project Description */}
        <div className="mb-6">
          <p className="text-justify">
            Tôi đang tìm kiếm một nghệ sĩ lồng tiếng chuyên nghiệp có giọng nói tràn đầy năng lượng và nhiệt tình để thổi hồn vào nội dung giáo dục trên YouTube của tôi hướng đến đối tượng là thanh thiếu niên...
          </p>
        </div>

        {/* Project Tags */}
        <div className="flex gap-2 mb-4">
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Tài năng giọng nói</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Dịch vụ âm thanh</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Quảng cáo</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Sản xuất âm thanh</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Tiếp tục truyền thông xã hội</span>
        </div>

        {/* Project Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Mã dự án: 38751624</p>
          <h3 className="font-semibold text-lg mt-4">Về dự án</h3>
          <div className="flex items-center gap-6 mt-2 text-gray-500 text-sm">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
              <p>9 đề xuất</p>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faGavel} className="mr-1" />
              <p>Mở đấu giá</p>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
              <p>Dự án từ xa</p>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-1" />
              <p>Hoạt động 1 ngày trước</p>
            </div>
          </div>
        </div>

        {/* Bid and Benefits Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Bid Section */}
          <div className="bg-gray-50 p-4 rounded-lg md:w-1/2">
            <h2 className="font-semibold text-lg mb-4">Đặt giá thầu của bạn</h2>
            <input
              type="date"
              placeholder="Thời gian dự án"
              className="border rounded-md w-full p-2 mb-4"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">Đấu thầu dự án</button>
          </div>

          {/* Freelancer Benefits */}
          <div className="bg-gray-50 p-4 rounded-lg md:w-1/2">
            <h3 className="font-semibold text-lg mb-4">Lợi ích của việc đấu thầu trên Freelancer</h3>
            <ul className="list-none text-gray-700">
              <li className="flex items-center mb-2">
                <span className="text-green-500 mr-2">✔</span>
                Thiết lập ngân sách và khung thời gian của bạn
              </li>
              <li className="flex items-center mb-2">
                <span className="text-green-500 mr-2">✔</span>
                Được trả tiền cho công việc của bạn
              </li>
              <li className="flex items-center mb-2">
                <span className="text-green-500 mr-2">✔</span>
                Phác thảo đề xuất của bạn
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span>
                Đăng ký và đấu thầu công việc là miễn phí
              </li>
            </ul>
          </div>
        </div>

        {/* Bidder List */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-4">9 người làm việc tự do đang trả giá trung bình 288 đô la Mỹ cho công việc này</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 border-t pt-4 mt-4">
              <img src="https://via.placeholder.com/50" alt="Bidder" className="rounded-full" />
              <div>
                <h4 className="font-semibold">@Khanuitech</h4>
                <p className="text-gray-500">300 đô la Mỹ trong 1 ngày</p>
                <p className="text-yellow-500">{renderStars(4.2)} 4.2 (9 đánh giá)</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-t pt-4 mt-4">
              <img src="https://via.placeholder.com/50" alt="Bidder" className="rounded-full" />
              <div>
                <h4 className="font-semibold">@softsolution2000</h4>
                <p className="text-gray-500">488 đô la Mỹ trong 7 ngày</p>
                <p className="text-yellow-500">{renderStars(5.0)} 5.0 (1 đánh giá)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:w-1/4 space-y-6">
        <button className="bg-pink-500 text-white font-semibold w-full p-3 rounded-lg">Đăng một dự án như thế này</button>

        {/* Customer Info */}
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="font-semibold text-lg">Về khách hàng</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg">🇪🇬</span>
            <p className="text-gray-700">Giza, Ai Cập</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <FontAwesomeIcon icon={faUser} />
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon key={index} icon={faStar} className="text-gray-300" />
              ))}
              <span className="ml-1">0.0</span>
            </div>
            <FontAwesomeIcon icon={faComments} className="ml-3" />
            <span>0</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <FontAwesomeIcon icon={faClock} className="mr-1" />
            <p>Thành viên từ 12 tháng 9, 2024</p>
          </div>
          <hr className="my-2" />
          <h4 className="font-semibold text-md">Xác minh khách hàng</h4>
          <div className="text-gray-500 text-sm space-y-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              <p>Xác minh danh tính</p>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              <p>Xác minh email</p>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              <p>Xác minh số điện thoại</p>
            </div>
          </div>
          <hr className="my-2" />
          <h4 className="font-semibold text-md">Các công việc khác từ khách hàng này</h4>
          <a href="#" className="text-blue-600 text-sm">YouTube Script về nền văn minh cổ đại</a>
          <p className="text-gray-500 text-sm">10-30 đô la Mỹ</p>
          <a href="#" className="text-blue-600 mt-4 text-sm">Người tạo video UGC thời trang Ả Rập</a>
          <p className="text-gray-500 text-sm">30-250 đô la Mỹ</p>
        </div>

        {/* Similar Projects */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg mb-4">Công việc tương tự</h3>
          <a href="#" className="text-blue-600">Thu âm bài hát nhạc Pop với nhạc cụ hợp âm</a>
          <p className="text-gray-500 text-sm">30-250 đô la Mỹ</p>
          <a href="#" className="text-blue-600 mt-4">Video Demo Tính Năng Sản Phẩm</a>
          <p className="text-gray-500 text-sm">12500-37500 INR</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
