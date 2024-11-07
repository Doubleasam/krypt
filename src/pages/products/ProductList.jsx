/* eslint-disable react/prop-types */
import React from 'react'
import { fakeData } from '../../extras/fakeData'
import PreviewBtn from '../../components/PreviewBtn'

function ProductList({listEnd=10,writeUp}) {

  return (
    <React.Fragment>
        <div className=' flex flex-col gap-10 py-5'>
            <header className=' flex flex-col items-center gap-3 px-2 text-white'>
                <h1 className=" font-[helvetica] text-shadow uppercase text-2xl text-center font-black">products</h1>
                {writeUp && <article className=' sm:text-base  text-center font-medium  text-sm'>
                    We have two colors for this collection. You either conquer the day with blue or classic with black. All items are carefully hand tailored by KRYPT. Each variation are uniquely tagged and identifyable by its number and address
                </article>}
            </header>
            <main className=' grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 md:gap-x-8 px-3 gap-x-3 gap-y-5'>
                {
                    fakeData.slice(0,listEnd).map((eachImg,index)=>{
                        return(
                            <div key={eachImg.unique_id+index+"#"} className=' bg-gray-700 border-[1px] border-white rounded-md px-1 py-2 gap-3 flex flex-col '>
                                <section className=" flex flx-col justify-center">
                                    <img src={eachImg.img} alt={eachImg.name} className=' size-32 rounded-md ' loading="lazy"/>
                                </section>
                                <section className=' grid grid-cols-2 items-center justify-center gap-2'>
                                    <span className=' px-3 font-semibold italic font-[monospace] text-xl'>{String(eachImg.id).length<3?'0'+eachImg.id:eachImg.id}</span>
                                    <span className=' px-3 font-semibold  text-right'>${eachImg.price}</span>
                                    <p className=' text-center  col-span-2 text-white font-medium text-lg'>{eachImg.name}</p>
                                </section>
                                <section className=' gap-2 flex flex-col'>
                                    <PreviewBtn id={eachImg.unique_id}/>
                                </section>
                            </div>
                        )
                    })
                }
            </main>
        </div>
    </React.Fragment>
  )
}

export default ProductList