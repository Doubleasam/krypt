import { doc, setDoc, query, getDocs,getDoc, collection } from "firebase/firestore"; 
import { db } from './firebaseConfig';
import { toast } from "react-toastify";



export const saveOrderInfo = async (userId, nftMetadata, billingInfo) => {
    try {
        await setDoc(doc(db, "orders", nftMetadata.nftAddress), {
        nftMetadata,
        billingInfo,
        createdAt: new Date(),
        userId,
        state: "active"
        });
        console.log("Order saved successfully!");
        toast.warn("Order Saved Successfully")

    } catch (error) {
        console.error("Error saving order: ", error);
        toast.warn("Error saving order")
    }
}

export const fetchOrders = async () => {
    try {
        const q = query(collection(db, "orders"));
        const ordersSnapshot = await getDocs(q);

        console.log(ordersSnapshot)
        const ordersData = ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        console.log(ordersData)
        return ordersData;
    }catch (error) {
        console.error("Error fetching orders: ", error);
        
    }

}


export const fetchorderById = async (orderId) => { 
    try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error fetching order: ", error);
    }
}

export const updateOrderState = async (orderId, newState) => {
    try {
        await setDoc(doc(db, "orders", orderId), { state: newState }, { merge: true });
        console.log("Order state updated successfully!");
    } catch (error) {
        console.error("Error updating order state: ", error);
    }
}

