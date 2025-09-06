'use client';

import { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

export default function ChatBot() {
  const [prompt, setPrompt] = useState('');
  const [recipe, setRecipe] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(''); // Clear any previous error messages
    try {
      const response = await axios.post('/api/chatbot', { prompt: prompt });
      if (response.status === 200) {
        setRecipe(response.data.recipe);
        setImageURL(response.data.imageURL);
      } else {
        setErrorMessage(
          'Failed to generate recipe and image.  Server returned an error. Status Code: ' +
            response.status
        );
      }
    } catch (error) {
      console.error('Error generating recipe and image:', error);
      setErrorMessage(
        'Failed to generate recipe and image. Please check your internet connection and try again. Details: ' +
          error.message
      ); // Include error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-500">
      <h1 className="text-2xl font-bold mb-4">Recipe and Image Generator</h1>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="prompt"
        >
          Enter Keywords:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="prompt"
          type="text"
          placeholder="e.g., chicken, pasta, vegetables"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ClipLoader color="#ffffff" size={20} />
        ) : (
          'Generate Recipe and Image'
        )}
      </button>

      {errorMessage && (
        <div className="text-red-500 mt-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {recipe && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Recipe:</h2>
          <p>{recipe}</p>
        </div>
      )}

      {imageURL && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Image:</h2>
          <img src={imageURL} alt="Generated Recipe" className="max-w-md" />
        </div>
      )}
    </div>
  );
}
