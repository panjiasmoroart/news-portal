/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import news from "../../assets/news.png";
import { base_url } from '../../config/config';
import axios from 'axios';
import storeContext from '../../context/storeContext';

const AdminIndex = () => {
  const { store } = useContext(storeContext)
    const [news,setNews] = useState([]) 

    const get_news = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/news`, {
                headers: {
                    'Authorization' : `Bearer ${store.token}`
                }
            })    
            setNews(data.news)
        } catch (error) {
            console.log(error)
        }
    } 

    useEffect(() => {
        get_news()
    },[])

  const [start, setStart] = useState({
    totalNews: 0,
    pendingNews: 0,
    activeNews: 0,
    deactiveNews: 0,
    totalWriters:0
  }); 

  useEffect(() => {
      const fetchStars = async () => {
          try {
              const {data} = await axios.get(`${base_url}/api/news-statistics`);
              setStart(data)
          } catch (error) {
              console.log(error)
          }
      }
      fetchStars()
  },[]);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
            {title: 'Total News', value:start.totalNews, color: 'text-red-500'},
            {title: 'Pending News', value:start.pendingNews, color: 'text-purple-500'},
            {title: 'Active News', value:start.activeNews, color: 'text-cyan-500'},
            {title: 'Deactive News', value:start.deactiveNews, color: 'text-blue-500'},
            {title: 'Writers', value:start.totalWriters, color: 'text-green-500'},
        ].map((start, i) => (
          <div
            key={i}
            className="p-8 bg-white rounded-lg shadow-md flex flex-col items-center gap-2"
          >
            <span className={`text-4xl font-bold ${start.color}`}>
              {start.value}
            </span>
            <span className="text-md font-semibold text-gray-600">
              {start.title}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 mt-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center pb-4 border-b border-gray-500">
          <h2 className="text-xl font-bold text-gray-600">Recent News</h2>
          <Link
            to="/news"
            className="text-blue-500 hover:text-blue-800 font-semibold transition duration-300"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="w-full table-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-4 px-6 text-left">No</th>
                <th className="py-4 px-6 text-left">Title</th>
                <th className="py-4 px-6 text-left">Image</th>
                <th className='py-4 px-6 text-left'>Category</th> 
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
            {news.slice(0, 5).map((n, index) => (
                <tr key={index} className="border-t">
                 <td className='py-4 px-6'>{index+1}</td>
                 <td className='py-4 px-6'>{ n.title.slice(0,15) }...</td>
                  <td className="py-4 px-6">
                    <img className='w-10 h-10 rounded-full object-cover' src={ n.image } alt="news" />
                  </td>
                  <td className='py-4 px-6'>{ n.category }</td> 
                  <td className='py-4 px-6'>{ n.date }</td>
                  <td className="py-4 px-6">
                    {
                        n.status === 'pending' && <span className='px-2 py-[2px] bg-blue-200 text-blue-800 rounded-md text-xs'>{n.status} 
                        </span>
                    }
                    {
                        n.status === 'active' && <span className='px-2 py-[2px] bg-green-200 text-green-800 rounded-md text-xs'>{n.status} 
                        </span>
                    }
                    {
                        n.status === 'deactive' && <span className='px-2 py-[2px] bg-red-200 text-red-800 rounded-md text-xs'>{n.status} 
                        </span>
                    }
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3 text-gray-500">
                      <Link
                        to="#"
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-800"
                      >
                        <FaEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminIndex;
