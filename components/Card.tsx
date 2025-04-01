import React from 'react';
import { IconType } from 'react-icons';

interface CardProps {
  title: string;
  description: string;
  Icon: IconType;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, description, Icon, color }) => {
  return (
    <div className="bg-gray-500 text-white rounded-lg p-4 text-center shadow-md">
      <div className={`text-4xl mb-4 ${color}`}>
        <Icon />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-800">{description}</p>
    </div>
  );
};

export default Card;
