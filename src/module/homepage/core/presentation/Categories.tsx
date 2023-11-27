import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Typography } from '@mui/material';

interface TabPanelProps {
  children: undefined | React.ReactNode;
  index: number;
  category: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, category, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={category !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {category === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Categories() {
  const [currentCategory, setCurrentCategory] = useState(0);

  const handleChange = (event: React.SyntheticEvent, category: number) => {
    setCurrentCategory(category);
  };

  return (
    <>
      <Typography className="mt-4">
        The 4 categories are the following:
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentCategory}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: '#041295',
              },
            }}
            sx={{
              '.Mui-selected': {
                color: '#041295',
              },
            }}
            className="mt-4"
          >
            <Tab
              label="Energy (E)"
              {...a11yProps(0)}
              className="flex-shrink-0"
            />
            <Tab
              label="Material/Movement (M)"
              {...a11yProps(1)}
              className="flex-shrink-0"
            />
            <Tab
              label="Energy & Material (EM)"
              {...a11yProps(2)}
              className="flex-shrink-0"
            />
            <Tab label="X" {...a11yProps(3)} className="flex-shrink-0" />
          </Tabs>
        </Box>
        <div className="p-2 border border-bluegrey-200">
          <CustomTabPanel category={currentCategory} index={0}>
            <Typography className="ml-s">
              <span className="flex flex-col">
                <p>
                  Impacts of operating energy (i.e. caused by its production in
                  power plants) consumed by the equipment prevail over the other
                  lifecycle aspects (e.g. manufacturing impacts).
                </p>
                <p className="mt-4">
                  Energy consumption decrease should be targeted to reduce
                  efficiently environmental impacts.
                </p>
              </span>
            </Typography>
          </CustomTabPanel>
          <CustomTabPanel category={currentCategory} index={1}>
            <Typography className="ml-s">
              <span className="flex flex-col">
                <p>
                  Impacts of the product movement in use (i.e. caused by
                  vehicles) along thee whole lifecycle overcome all other
                  sources of impacts including the operating energy in use.
                  Product mass decrease should be targeted to reduce efficiently
                  environmental impacts.
                </p>
                <p className="mt-4">
                  Energy consumption decrease should be targeted to reduce
                  efficiently environmental impacts.
                </p>
              </span>
            </Typography>
          </CustomTabPanel>
          <CustomTabPanel category={currentCategory} index={2}>
            <Typography className="ml-s">
              <span className="flex flex-col">
                <p>
                  Impacts from both operating energy and movement are important.
                </p>
                <p className="mt-4">
                  Both aspects from the use phase are to be considered in
                  priority.
                </p>
              </span>
            </Typography>
          </CustomTabPanel>
          <CustomTabPanel category={currentCategory} index={3}>
            <span className="flex flex-col">
              <p>
                This case is expected to be quite rare in Thales. Impacts from
                use phase (related to operating energy and movement) are not
                predominant.
              </p>
              <p className="mt-4">
                Manufacturing process alternatives may be for instance relevant
                to decrease the impacts. Yet it does not mean that the use phase
                must be neglected or forgotten. It simply means environmental
                facts do not justify a priority action on those items.
              </p>
            </span>
          </CustomTabPanel>
        </div>
      </Box>
    </>
  );
}

export default Categories;
