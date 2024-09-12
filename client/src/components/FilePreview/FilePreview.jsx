import React from 'react';
import { Card, List, ListItem } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import styles from './FilePreview.module.css';

const FilePreview = ({ fileInfos, download }) => {
  const renderFilePreview = () => {
    const fileType = fileInfos.name.split('.').pop().toLowerCase();

    if (fileType === 'pdf') {
      return <embed src={fileInfos.url} width="140" type="application/pdf" />;
    } else if (['jpeg', 'jpg', 'png', 'gif'].includes(fileType)) {
      return <img src={fileInfos.url} alt={fileInfos.name} width={140} />;
    } else {
      return (
        <div className={styles.file_placeholder}>
          <span>{fileInfos.name}</span>
        </div>
      );
    }
  };

  return (
    <Card className={styles.output}>
      <List>
        <ListItem className={styles.list_item}>
          <div className={styles.file_preview_wrapper}>
            {renderFilePreview()}
            <div className={styles.download_icon_wrapper} onClick={download}>
              <CloudDownloadIcon className={styles.download_icon} />
            </div>
          </div>
        </ListItem>
      </List>
    </Card>
  );
};

export default FilePreview;
