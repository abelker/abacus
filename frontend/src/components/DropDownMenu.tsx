import React from "react";
import { useState } from 'react'; 
import DropDownButton from './DropDownButton'; 
import DropDownContent from './DropDownContent'; 
import './DropDownMenu.scss';

interface DropDownMenuProps {
    buttonText: string;
    content: (close: () => void) => React.ReactNode;
}

const DropDownMenu = ({buttonText, content}: DropDownMenuProps) => { 
    
    const [open, setOpen] = useState(false);
    const toggleDropdown = () => { 
        setOpen(!open);
    };
    const closeDropdown = () => {
        setOpen(false);
    };

    return( 
        <div className="dropdown">
            <DropDownButton toggle={ toggleDropdown } open={ open }>{buttonText}</DropDownButton>
            <DropDownContent open={ open }>{content(closeDropdown)}</DropDownContent>
        </div> 
    )
}

export default DropDownMenu;
