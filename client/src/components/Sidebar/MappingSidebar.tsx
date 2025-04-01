import React, { useState } from 'react';
import { useSaveLoadActions } from 'state/editor/Helpers';

type Props = {}

const PageMenu = ({ pageNum, onDelete, onClose, onSwitch }: { 
  pageNum: number, 
  onDelete: () => void, 
  onClose: () => void,
  onSwitch: () => void 
}) => {
  const [pagename, setPagename] = useState('');
  const [subdomain, setSubdomain] = useState('');

  const handlePagenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagename(e.target.value);
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubdomain(e.target.value);
  };

  return (
    <div className="page-menu">
      <input
        type="text"
        className="text-input"
        placeholder="Page Name"
        value={pagename}
        onChange={handlePagenameChange}
      />
      <input
        type="text"
        className="text-input"
        placeholder="Subdomain"
        value={subdomain}
        onChange={handleSubdomainChange}
      />
      <button className="menu-button switch-button" onClick={onSwitch}>Switch to Page</button>
      <button className="menu-button delete-button" onClick={onDelete}>Delete Page</button>
      <button className="menu-button close-button" onClick={onClose}>Close</button>
    </div>
  );
};

const MappingSidebar = (props: Props) => {
  const [pages, setPages] = useState(() => {
    const savedPages = localStorage.getItem('Pages');
    return savedPages ? JSON.parse(savedPages) : [1];
  });
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [editingPage, setEditingPage] = useState<number | null>(() => {
    const savedEditingPage = localStorage.getItem('currentEditingPage');
    return savedEditingPage ? parseInt(savedEditingPage) : 1;
  });
  const { loadFromLocalStorage, saveToLocalStorage } = useSaveLoadActions();

  // Save current editing page whenever it changes
  React.useEffect(() => {
    if (editingPage !== null) {
      localStorage.setItem('currentEditingPage', editingPage.toString());
    }
  }, [editingPage]);

  React.useEffect(() => {
    localStorage.setItem('Pages', JSON.stringify(pages));
  }, [pages]);

  const handleAddPage = () => {
    setPages([...pages, pages.length + 1]);
  };

  const handlePageClick = (pageNum: number) => {
    setSelectedPage(selectedPage === pageNum ? null : pageNum);
  };

  const handleDeletePage = (pageNum: number) => {
    setPages(pages.filter(p => p !== pageNum));
    setSelectedPage(null);
  };

  const handleSwitchPage = (pageNum: number) => {
    console.log('Current editing page:', editingPage);
    if (editingPage !== null) {
      console.log('Attempting to save page:', editingPage);
      saveToLocalStorage(editingPage.toString());
      console.log('Save completed');
    }
    console.log('Switching to page:', pageNum);
    setEditingPage(pageNum);
    loadFromLocalStorage(pageNum.toString());
  };

  return (
    <aside className='style-sidebar'>
      <header className='sidebar-header'>
        <h2>PAGES</h2>
      </header>
      <div className="grid-container" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {pages.map((pageNum) => (
          <div key={pageNum} className="page-container">
            <button 
              className={`page-button ${selectedPage === pageNum ? 'selected' : ''}`}
              onClick={() => handlePageClick(pageNum)}
            >
              Page {pageNum}
            </button>
            {selectedPage === pageNum && (
              <PageMenu 
                pageNum={pageNum}
                onSwitch={() => handleSwitchPage(pageNum)}
                onDelete={() => handleDeletePage(pageNum)}
                onClose={() => setSelectedPage(null)}
              />
            )}
          </div>
        ))}
        <button 
          className="add-page-button"
          onClick={handleAddPage}
        >
          + Add Page
        </button>
      </div>
    </aside>
  );
}

export default MappingSidebar;