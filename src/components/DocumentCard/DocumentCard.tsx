import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import './DocumentCard.css'
import { IDocument } from '../../types/types';
import { useState } from 'react';

interface DocumentCardProps {
  document: IDocument
}

function DocumentCard({document}:DocumentCardProps) {
  const [isActive, setIsActive] = useState(false);


  return (
    <div className='documentCard' onClick={() => setIsActive(!isActive)}>
      <div className='documentTitle'>
        <div>{document.title}</div>
        <div>{isActive ? <FiChevronUp/> : <FiChevronDown/>}</div>
      </div>
      {isActive &&
        <div className="documentBodyWindow">
          <div className="documentInfoContainer">
            <div className="">ID документа: {document.id}</div>
            <div>Дата создания: {document.date.substring(0,10)}</div>
          </div>
          <div className='documentBody'>{document.body}</div>
        </div>
      }
    </div>
  );
}

export default DocumentCard;