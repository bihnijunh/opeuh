"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { FaCopy, FaQrcode } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import QRCode from "qrcode.react";
import { motion } from "framer-motion";
import Image from 'next/image';

const cryptoIcons = {
  btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032",
  usdt: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
  eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032"
};

const cryptocurrencyOptions = [
  { name: "BTC", address: "16FfUiyaw7xQqbJWEPLc3QxubvawTPWjo7", icon: cryptoIcons.btc, network: "Bitcoin" },
  { name: "USDT", address: "TFvYytGvjMUvQkPQZofKXQ3ZhTUSXD4LQ6", icon: cryptoIcons.usdt, network: "Tron" },
  { name: "ETH", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", icon: cryptoIcons.eth, network: "Ethereum" },
];

export default function ReceiveComponent() {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencyOptions[0]);
  const [showQR, setShowQR] = useState(false);

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(selectedCrypto.address)
      .then(() => toast.success("Address copied to clipboard"))
      .catch(() => toast.error("Failed to copy address"));
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Receive Crypto
      </h2>

      <div className="space-y-8">
        <div className="flex flex-wrap justify-start gap-4">
          {cryptocurrencyOptions.map((crypto) => (
            <motion.button
              key={crypto.name}
              onClick={() => setSelectedCrypto(crypto)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full transition duration-300 ease-in-out flex items-center ${
                selectedCrypto.name === crypto.name
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Image src={crypto.icon} alt={crypto.name} width={24} height={24} className="mr-2" />
              {crypto.name}
            </motion.button>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-xl">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Selected Network</span>
            <span className="text-xs sm:text-sm font-medium">{selectedCrypto.network}</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={selectedCrypto.address}
              className="flex-grow bg-white dark:bg-gray-600 text-gray-800 dark:text-white px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <motion.button
              onClick={copyAddressToClipboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              title="Copy to clipboard"
            >
              <FaCopy size={16} className="sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <motion.button
            onClick={() => setShowQR(!showQR)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 mr-4 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FaQrcode size={20} className="mr-2" />
            {showQR ? "Hide" : "Show"} QR Code
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Important Information"
          >
            <FiInfo size={24} />
          </motion.button>
        </div>

        {showQR && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center"
          >
            <QRCode value={selectedCrypto.address} size={200} />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Scan this QR code to receive {selectedCrypto.name}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}