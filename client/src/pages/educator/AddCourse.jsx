import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'

const AddCourse = () => {

  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image,setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const [lectureDetails, setLectureDetails] = useState(
    {
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,

    }
)

useEffect(() => {
  //Initialize Quill editor only once
  if(!quillRef.current && editorRef.current) {
    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
    })
  }
}, [])


  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input 
            type="text" 
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'  
          />
        </div>  

        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input 
            type="number" 
            onChange={(e) => setCoursePrice(e.target.value)}
            value={coursePrice}
            placeholder='0'
            className='outline-none md:py-2.5 py-2 px-3 w-28 rounded border border-gray-500' 
            required 
          />
          </div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
              <input 
                type="file" 
                id='thumbnailImage' 
                onChange={(e) => setImage(e.target.files[0])} 
                accept='image/*' 
                hidden 
              />
              <img src={image ? URL.createObjectURL(image) : ''} alt="" className='max-h-10' />
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input 
            type="number" 
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            placeholder='0'
            min={0}
            max={100}
            className='outline-none md:py-2.5 py-2 px-3 w-28 rounded border border-gray-500'
          />
        </div>

        {/* Adding Chapters & Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className='bg-white border rounded-lg mb-4 '>
              <div className='flex justify-between items-center p-4 border-b'>
                <div className='flex items-center'>
                  <img 
                    src={assets.dropdown_icon} 
                    width={14} alt="" 
                    className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && '-rotate-90'}`} 
                  />
                  <span className='font-semibold'>{chapterIndex + 1} {chapter.chapterTitle} </span>

                </div>
                <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                <img src={assets.cross_icon} alt="" className='cursor-pointer' />
              </div>

              {!chapters.collapsed && (
                <div className='p-4'>
                  {chapters.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className='flex justify-between items-center mb-2'>
                      
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      
      </form>


    </div>
  )
}

export default AddCourse
