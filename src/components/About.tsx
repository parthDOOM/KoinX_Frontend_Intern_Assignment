//desc: This is the about section of the application
//date: 10-01-2025

import { FaArrowRight } from "react-icons/fa";

function About() {
  return (
    <div className="bg-white h-max rounded-lg my-5 lg:p-6 p-2">
      <div>
        <div className="text-2xl font-semibold text-[#0F1629]">
          About Bitcoin
        </div>
        <div className="mt-6 ">
          <div className="text-lg font-bold text-[#0B1426]">
            What is Bitcoin?
          </div>
          <div className="mt-2 pb-4 text-[#3E424A] font-medium border-b-2 border-[#C9CFDD]/40">
          Bitcoin is a decentralized digital currency, operating without a central bank or single administrator. As of today, Bitcoin's price stands at approximately US$93,320.00. Over the last 24 hours, the trading volume has been around $39.69 billion, with BTC experiencing a slight decline of -0.78%. The cryptocurrency currently has a circulating supply of about 19.8 million BTC, out of a capped maximum supply of 21 million BTC. Its scarcity, along with growing institutional adoption, continues to drive its value and impact on global financial markets.
          </div>
        </div>
        <div className="mt-2 border-b-2 border-[#C9CFDD]/40 pb-4">
          <div className="text-lg text-[#0B1426] font-bold">
            Lorem ipsum dolor sit amet
          </div>
          <div className="text-[#3E424A] font-medium mt-2">
            Lorem ipsum dolor sit amet consectetur. Aliquam placerat sit
            lobortis tristique pharetra. Diam id et lectus urna et tellus
            aliquam dictum at. Viverra diam suspendisse enim facilisi diam ut
            sed. Quam scelerisque fermentum sapien morbi sodales odio sed
            rhoncus. Ultricies urna volutpat pendisse enim facilisi diam ut sed.
            Quam scelerisque fermentum sapien morbi sodales odio sed rhoncus.
          </div>

          <div className="mt-6 text-[#3E424A] font-medium">
            Diam praesent massa dapibus magna aliquam a dictumst volutpat.
            Egestas vitae pellentesque auctor amet. Nunc sagittis libero
            adipiscing cursus felis pellentesque interdum. Odio cursus phasellus
            velit in senectus enim dui. Turpis tristique placerat interdum sed
            volutpat. Id imperdiet magna eget eros donec cursus nunc. Mauris
            faucibus diam mi nunc praesent massa turpis a. Integer dignissim
            augue viverra nulla et quis lobortis phasellus. Integer pellentesque
            enim convallis ultricies at.
          </div>
          <div className="mt-6 text-[#3E424A] font-medium">
            Fermentum hendrerit imperdiet nulla viverra faucibus. Sit aliquam
            massa vel convallis duis ac. Mi adipiscing semper scelerisque
            porttitor pulvinar nunc risus. Fermentum potenti iaculis lacinia
            congue ipsum fames amet dui. Purus ultrices tincidunt volutpat in
            eget. Ullamcorper dui
          </div>
        </div>

        <div className=" mt-2 py-2">
          <div className="text-[#0F1629] text-2xl font-semibold">
            Already Holding Bitcoin?
          </div>
          <div className="lg:flex border-b-2 border-[#C9CFDD]/40 pb-4">
            <div className="mt-4">
              <div className="lg:w-[400px] h-[151px] bg-gradient-to-br from-[#79F1A4] to-[#0E5CAD] rounded-lg flex">
                <div className="p-3">
                  <img
                    className="w-32 h-32 rounded-xl object-right object-cover"
                    src="public/about_img_1.png"
                    alt=""
                  />
                </div>
                <div className="items-center p-4 flex flex-col justify-center mr-10">
                  <div className=" text-white text-xl">
                    Calculate your Profits
                  </div>
                  <div className="bg-white px-3 py-2 rounded-lg mt-3 flex items-center">
                    Check Now
                    <FaArrowRight className="ml-2 font-normal" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:ml-8">
              <div className="lg:w-[400px] h-[151px] bg-gradient-to-br from-[#FF9865] to-[#EF3031] rounded-lg flex">
                <div className="p-3">
                  <img
                    className="w-32 h-32 rounded-xl object-right object-cover"
                    src="public/about_img_2.png"
                    alt=""
                  />
                </div>
                <div className="items-center p-4 flex flex-col justify-center mr-10">
                  <div className=" text-white text-xl">
                  Calculate your tax liability
                  </div>
                  <div className="bg-white px-3 py-2 rounded-lg mt-3 flex items-center">
                    Check Now
                    <FaArrowRight className="ml-2 font-normal" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-2 text-[#3E424A] font-medium ">
          Fermentum hendrerit imperdiet nulla viverra faucibus. Sit aliquam
          massa vel convallis duis ac. Mi adipiscing semper scelerisque
          porttitor pulvinar nunc risus. Fermentum potenti iaculis lacinia
          congue ipsum fames amet dui. Purus ultrices tincidunt volutpat in
          eget. Ullamcorper dui
        </div>
      </div>
    </div>
  );
}

export default About;