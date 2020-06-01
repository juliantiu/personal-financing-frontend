import React, { useContext, useState } from 'react';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import AddCategoryModal from './AddCategoryModal';
import UpdateCategoryModal from './UpdateCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import CloneBudgetModal from './CloneBudgetModal';

import { AuthContext } from "../../../../contexts/AuthState";

import app from '../../../../firebase';

function logout() {
  app.auth().signOut();
}

export default function ControlButton(props) {
  const { currentUser } = useContext(AuthContext);
  const { month, year } = props;
  const [toggleClass, setToggleClass] = useState('control-button-menu');

  const handleClick = () => {
    setToggleClass('control-button-menu control-button-menu-grow');
  };

  const handleClickAway = () => {
    setToggleClass('control-button-menu');
  }
  
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="control-button" onClick={handleClick}>
        <div className={toggleClass}>
          <button className="menu-button" onClick={logout}>
            <Tooltip title="logout" placement="left">
              <PowerSettingsNewIcon fontSize="large"/>
            </Tooltip>
          </button>
          <button className="menu-button">
              <AddCategoryModal 
                month={month} 
                year={year}
                currentUser={currentUser}
              />
          </button>
          <button className="menu-button">
            <UpdateCategoryModal 
              month={month} 
              year={year}
              currentUser={currentUser}
            />
          </button>
          <button className="menu-button">
            <DeleteCategoryModal 
              month={month} 
              year={year}
              currentUser={currentUser}
            />
          </button>
          <button className="menu-button">
            <CloneBudgetModal 
              month={month} 
              year={year}
              currentUser={currentUser}
            />
          </button>
          <Tooltip title="Scroll Up" placement="left">
            <button 
              type="button" 
              onClick={() => document.getElementById('top').scrollIntoView()} 
              className="menu-button"
            >
              <KeyboardArrowUpIcon fontSize="large" />
            </button>
          </Tooltip>
        </div>
      </div>
    </ClickAwayListener>
  );
}