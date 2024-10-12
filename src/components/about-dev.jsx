import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { Grid2 } from '@mui/material';

export default function LinksComponent() {
  const socialLinks = [
    {
      title: 'Portfolio & Other Projects',
      icon: <LanguageIcon color="primary" />,
      target: 'https://hidayat-portfolio.web.app/',
    },
    {
      title: 'Github',
      icon: <GitHubIcon color="primary" />,
      target: 'https://github.com/KhanStan99',
    },
    {
      title: 'Twitter',
      icon: <TwitterIcon color="primary" />,
      target: 'https://twitter.com/KhanStan99',
    },
    {
      title: 'Instagram',
      icon: <InstagramIcon color="primary" />,
      target: 'https://www.instagram.com/KhanStan99/',
    },
    {
      title: 'LinkedIn',
      icon: <LinkedInIcon color="primary" />,
      target: 'https://www.linkedin.com/in/userhidayatkhan/',
    },
  ];

  const ytLinks = [
    {
      title: 'Hidayat Khan',
      icon: <VideoCallIcon color="primary" />,
      target: 'https://www.youtube.com/channel/UCAwvnxzb2YgftWrF8Vu7FuA',
    },
    {
      title: 'SHAF (Gaming)',
      icon: <VideoCallIcon color="primary" />,
      target: 'https://www.youtube.com/c/SHAF399/videos',
    },
  ];

  const handleListItemClick = (target) => {
    window.open(target, '_blank');
  };

  return (
    <Grid2 padding={2}>
      <Typography
        color="primary"
        variant="h4"
        component="h2"
        style={{ textAlign: 'start' }}
      >
        <b>Socials</b>
      </Typography>
      <List component="nav" aria-label="secondary mailbox folder">
        {socialLinks.map((item) => {
          return (
            <Grid2 key={item.target}>
              <ListItem button onClick={() => handleListItemClick(item.target)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
              <Divider />
            </Grid2>
          );
        })}
      </List>
      <Typography
        color="primary"
        variant="h4"
        component="h2"
        style={{ textAlign: 'start' }}
      >
        <b>Youtube Channel's</b>
      </Typography>
      <Grid2
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        {ytLinks.map((item) => {
          return (
            <Grid2 key={item.target} width={'100%'}>
              <ListItem button onClick={() => handleListItemClick(item.target)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
              <Divider />
            </Grid2>
          );
        })}
      </Grid2>
    </Grid2>
  );
}
