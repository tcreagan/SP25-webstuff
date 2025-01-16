import "styles/layout.css";
import { useSaveLoadActions } from "../../../state/editor/Helpers";
import { useState } from "react";

const PageHeader = () => {
  const { saveToLocalStorage, loadFromLocalStorage } = useSaveLoadActions();
  const [saveMessage, setSaveMessage] = useState("Save");
  const [loadMessage, setLoadMessage] = useState("Load");

  const handleSaveClick = () => {
    saveToLocalStorage();
    setSaveMessage("Saved!");
    setTimeout(() => {
      setSaveMessage("Save");
    }, 2000); // Reset save message after 2 seconds
  };

  const handleLoadClick = () => {
    loadFromLocalStorage();
    setLoadMessage("Loaded!");
    setTimeout(() => setLoadMessage("Load"), 2000); // Reset load message after 2 seconds
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="page-info">
          <div className="page-name-section">
            <label htmlFor="pageName" className="page-label">
              Page name:
            </label>
            <span id="pageName" className="page-name">
              About Me
            </span>
          </div>
          <div className="permalink-section">
            <span className="permalink-label">Permalink:</span>
            <span className="permalink">
              johndoe.com/<a href="johndoe.com/about-me">about-me</a>
            </span>
          </div>
        </div>
      </div>

      <div className="header-middle">
        <span className="current-page-name">Current Page</span>
        <select name="current-page" className="current-page-dropdown">
          <option value="about">About Me</option>
          <option value="contact">Contact</option>
          <option value="bio">Biography</option>
          <option value="testimonials">Testimonials</option>
        </select>
      </div>

      <div className="header-right">
        <button className="save-button" onClick={handleSaveClick}>
          {saveMessage}
        </button>
        <button className="load-button" onClick={handleLoadClick}>
          {loadMessage}
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
