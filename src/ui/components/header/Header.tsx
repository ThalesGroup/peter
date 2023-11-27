import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import EmailIcon from '@mui/icons-material/Email';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Menu, { MenuProps } from '@mui/material/Menu';
import { styled, alpha } from '@mui/material/styles';
import ThalesLogo from '../../../../public/thales-build-logo-blue.svg';

function BrandLogo() {
  return <img src={ThalesLogo} alt="Logo Thales" width="163.19" />;
}

interface MenuLinkProps {
  path: string;
  label: string;
  value: number;
  setState: any;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function MenuLink({ setState, path, label, value }: MenuLinkProps) {
  // const urlMatch = useMatch(path);
  const navigate = useNavigate();

  const handleClick = (toPath: string) => navigate(toPath);

  return (
    <Tab
      label={label}
      className="flex-shrink-0"
      value={value}
      onClick={() => {
        setState(value);
        handleClick(path);
      }}
    />
  );
}

function getLastPart(url: string) {
  const parts = url.split('/');
  return parts.at(-1);
}

function Header() {
  const links = [
    {
      path: '/',
      label: 'About',
      value: 0,
    },
    {
      path: '/evaluation',
      label: 'Evaluation',
      value: 1,
    },
  ];

  const currentUrl = window.location.href;
  const index = links.findIndex((object) => {
    return object.path === `/${getLastPart(currentUrl)}`;
  });

  const [activeTab, setActiveTab] = React.useState(index);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-full">
      <AppBar position="static" className="bg-white-100">
        <Toolbar disableGutters>
          <BrandLogo />
          <Typography variant="body2" className="text-bluegrey-500 ml-4">
            PETER
          </Typography>
          <Divider
            orientation="vertical"
            variant="middle"
            sx={{ flexGrow: 1 }}
            flexItem
          />
          <Tabs
            value={activeTab}
            TabIndicatorProps={{
              style: {
                backgroundColor: '#041295',
              },
            }}
            className="text-bluegrey-500 ml-4"
            sx={{ flexGrow: 28 }}
          >
            {links.map((link) => (
              <MenuLink
                setState={setActiveTab}
                key={link.path}
                path={link.path}
                label={link.label}
                value={link.value}
              />
            ))}
          </Tabs>
          <Box sx={{ flexGrow: 0.5 }}>
            <Button variant="outlined" onClick={handleClick} disableElevation>
              Useful links
            </Button>
            <StyledMenu
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                component="a"
                aria-label="Go to Ecodesign space"
                rel="noopener noreferrer"
                target="_blank"
                className="flex"
                href=""
              >
                <ListItemIcon style={{ color: 'black' }}>
                  <EnergySavingsLeafIcon />
                </ListItemIcon>
                <ListItemText>Ecodesign space</ListItemText>
              </MenuItem>
              <MenuItem
                component="a"
                aria-label="Ask questions on PETER"
                href=""
                rel="noopener noreferrer"
                target="_blank"
                className="flex"
              >
                <ListItemIcon style={{ color: 'black' }}>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText>Questions</ListItemText>
              </MenuItem>
              <MenuItem
                component="a"
                aria-label="Mail to PETER"
                href=""
                rel="noopener noreferrer"
                target="_blank"
                className="flex"
              >
                <ListItemIcon style={{ color: 'black' }}>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText>Contact</ListItemText>
              </MenuItem>
            </StyledMenu>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
