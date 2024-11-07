import img from "../assets/nft_product.jpg" //black
import img2 from "../assets/nft_product2.jpg" //white
import img3 from "../assets/nft_product3.jpg" //blue

// Include both image and its color
const imageList = [
  { img: img, color: "black" },
  { img: img2, color: "white" },
  { img: img3, color: "blue" },
];

export const fakeData = Array(100).fill(0).map((_, index) => {
  const selectedImage = imageList[Math.floor(Math.random() * imageList.length)];
  
  return {
    id: index + 1,
    img: selectedImage.img, // Image source
    color: selectedImage.color, // Corresponding color
    price: 100,
    name: "NFT Product",
    description: "This is a description of the NFT product",
    category: "NFT pieces", 
    owner: "John Doe",
    unique_id: "0x1234567890" + (index + 1),
  };
});
