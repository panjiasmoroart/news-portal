import Image from "next/image";
import HeadLines from "@/components/HeadLines";
import SimpleNewsCard from "@/components/news/item/SimpleNewsCard";
import LatestNews from "@/components/news/LatestNews";
import Title from "@/components/Title";
import PopularNews from "@/components/news/PopularNews";
import DetailsNewsRow from "@/components/news/DetailsNewsRow";
import DetailsNews from "@/components/news/DetailsNews";
import DetailsNewsCol from "@/components/news/DetailsNewsCol";
import NewsCard from "@/components/news/item/NewsCard";
import { base_api_url } from "@/config/config";

const Home = async () => {

  // const news_data = await fetch(`${base_api_url}/api/all/news`);
  // console.log(news_data);

  return (
    <div>
     <main>
        <HeadLines />
        <div className="bg-slate-100">
          <div className="px-4 md:px-8 py-8">
            
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12">
                <LatestNews/>
              </div>

              <div className="w-full lg:w-6/12 mt-5 lg:mt-5">
                <div className="flex w-full flex-col gap-y-[14px] pl-0 lg:pl-2">
                  <Title title="Technology" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                    {
                      [1,2,3,4].map((item,i) => <SimpleNewsCard item={item} key={i} />
                      )
                    }
                  </div>
                </div>
              </div> 
            </div> 

            <PopularNews type="Popular News" />

            {/* first Section  */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-8/12">
                  <DetailsNewsRow category="Sports" type="details_news" />
                  <DetailsNews category="Health" />
                </div>

                <div className="w-full lg:w-4/12">
                  <DetailsNewsCol category="Education" />
                </div>
              </div> 
            </div>
            {/* end first Section  */}

            {/* 2nd Section  */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-4/12">
                  <div className="pl-3">
                    <DetailsNewsCol category="Politics" /> 
                  </div>
                </div>

                <div className="w-full lg:w-8/12">
                  <div className="pl-3">
                    <DetailsNewsRow category="Travel" type="details_news" />
                    <DetailsNews category="International" />
                  </div>
                </div>

              </div> 
            </div>
            {/* end 2nd Section  */}


            {/* 3nd Section  */}
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-8/12">
                  <DetailsNewsRow category="Technology" type="details_news" />
                </div>

                <div className="w-full lg:w-4/12">
                  <div className="pl-3">
                    <Title title="Recent News" />
                    <div className="grid grid-cols-1 gap-y-[8px] mt-2">
                      {
                        [1,2,3,4].map((item,i) => (
                          <NewsCard item={item} key={i} />
                        ))
                      }
                    </div> 
                  </div>  
                </div> 
              </div> 
            </div>
             {/* end 3nd Section  */}

          </div>
        </div>  
     </main>

                 
    </div>
  );
}

export default Home;