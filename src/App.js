import React, { useState, useEffect } from 'react';
import './App.css';
import { Client,Databases, Account, Storage, ID } from 'appwrite';
// import {v4 as uuidv4} from 'uuid';
import { nanoid } from 'nanoid';

const endpoint = 'https://cloud.appwrite.io/v1'; // Replace [APPWRITE_ENDPOINT] with your Appwrite endpoint
const project = '6475ed780344f01c4b66'; // Replace 'your_project_id' with your Appwrite project ID

const appwrite = new Client();

appwrite
  .setEndpoint(endpoint)
  .setProject(project)
  

const database = new Databases(appwrite,'6482b8700ed2023dc9e8');
const collectionId = '6482b877ca747cdc3edc';
const databaseId='6482b8700ed2023dc9e8';



function App() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      
      const response = await database.listDocuments(databaseId,collectionId);
      setReviews(response.documents);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  async function addReview(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    try {
      const documentId = nanoid();
      const response = await database.createDocument(databaseId,
        collectionId,
        documentId,
        {
          name: name,
          url: url,
          review: review,
        },
       
      );

      const newReview = {
        $id: response.$id,
        name: name,
        url: url,
        review: review,
      };

      setReviews((prevReviews) => [...prevReviews, newReview]);
      setName('');
      setUrl('');
      setReview('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  }

  return (
  <div className="container">
    <h1>Product Reviews</h1>
    <form className="form" onSubmit={addReview}>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="form-input"
      />
      <input
        type="text"
        placeholder="Enter product URL"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        className="form-input"
      />
      <textarea
        placeholder="Write your review"
        value={review}
        onChange={(event) => setReview(event.target.value)}
        className="form-textarea"
      ></textarea>
      <button type="submit" className="form-button">Submit Review</button>
    </form>
    <ul className="reviews">
      {reviews.map((review) => (
        <li key={review.$id} className="review">
          <h3>{review.name}</h3>
          <p>{review.review}</p>
          <p>{review.url}</p>
        </li>
      ))}
    </ul>
  </div>
);



}

export default App;

