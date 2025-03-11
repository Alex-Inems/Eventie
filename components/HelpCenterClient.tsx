'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';

const HelpCenterClient = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const auth = getAuth();
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
  }, [user, router]);

  const faqs = [
    {
      question: 'How can I reset my password?',
      answer: 'To reset your password, click on the "Forgot Password" link on the login page and follow the instructions.',
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact our support team by emailing support@company.com or using the live chat option.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to your profile page, click on "Edit Profile," and update your details.',
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleAnswer = (index: number) => {
    setIsOpen(isOpen === index ? null : index);
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Help Center</h1>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for help topics..."
          className="w-full sm:w-96 p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <div>
          {faqs
            .filter(faq =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((faq, index) => (
              <div key={index} className="mb-6 border-b pb-4">
                <div
                  onClick={() => toggleAnswer(index)}
                  className="cursor-pointer text-lg font-medium text-gray-700 hover:text-blue-600 transition duration-200"
                >
                  {faq.question}
                </div>
                {isOpen === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Support</h2>
        <p className="text-gray-700 mb-4">If you couldn&apos;t find an answer to your question, feel free to contact our support team!</p>
        <div className="space-y-4">
          <div>
            <label className="block text-lg text-gray-700">Email:</label>
            <p className="text-gray-600">support@company.com</p>
          </div>
          <div>
            <label className="block text-lg text-gray-700">Live Chat:</label>
            <p className="text-gray-600">Click the chat icon at the bottom-right of the page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterClient;
