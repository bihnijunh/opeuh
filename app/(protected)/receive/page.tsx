"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCopy } from "react-icons/fa";
import QRCode from "qrcode.react";

const cryptocurrencyOptions = [
  { name: "BTC", address: "16FfUiyaw7xQqbJWEPLc3QxubvawTPWjo7" },
  { name: "USDT", address: "TFvYytGvjMUvQkPQZofKXQ3ZhTUSXD4LQ6" },
  { name: "TRX", address: "TFvYytGvjMUvQkPQZofKXQ3ZhTUSXD4LQ6" },
];

export default function ReceiveComponent() {
  const [selectedCrypto, setSelectedCrypto] = useState(
    cryptocurrencyOptions[0]
  );
  const copyAddressToClipboard = () => {
    if (navigator.clipboard) {
      // Use the new clipboard API when it's available
      navigator.clipboard.writeText(selectedCrypto.address);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = selectedCrypto.address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Receive Cryptocurrency
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Select a cryptocurrency and copy the address to receive funds:
      </p>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          {cryptocurrencyOptions.map((crypto) => (
            <button
              key={crypto.name}
              onClick={() => setSelectedCrypto(crypto)}
              className={`px-4 py-2 border rounded-md transition duration-150 ease-in-out ${
                selectedCrypto === crypto
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {crypto.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">
            {selectedCrypto.name} Address
          </label>
          <input
            type="text"
            readOnly
            value={selectedCrypto.address}
            className="bg-gray-100 px-4 py-2 w-full border rounded-md focus:ring focus:ring-gray-200"
          />
          <button
            onClick={copyAddressToClipboard}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
            title="Copy to clipboard"
          >
            <FaCopy />
          </button>
        </div>

        <div className="mt-6 p-5">
          <label className="block text-xl font-medium text-gray-700">
            QR Code
          </label>
          <div className="mt-2 bg-white p-10 border rounded-md shadow-md text-center flex justify-center items-center">
            <QRCode value={selectedCrypto.address} size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}