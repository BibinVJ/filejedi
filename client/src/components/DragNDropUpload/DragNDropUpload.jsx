import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import styles from './DragNDropUpload.module.css';
import axios from 'axios';

import { Box, Button, LinearProgress, Alert, Card, CardHeader, List, ListItem } from '@mui/material';


const DragNDropUpload = ({ fromFormat, toFormat }) => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ text: '', severity: '' });
  const [fileInfos, setFileInfos] = useState([]);

  const upload = () => {
    let currentFile = selectedFiles[0];
    setProgress(0);
    setCurrentFile(currentFile);

    const formData = new FormData();
    formData.append('file', currentFile);
    formData.append('fromFormat', fromFormat); // Use the prop
    formData.append('toFormat', toFormat); // Use the prop

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    axios.post("http://localhost:5000/api/convert", formData, {
      onUploadProgress: (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      }
    }).then(res => {
      setMessage({ text: 'File converted successfully.', severity: 'success' });
      console.log(res);
      setFileInfos([...fileInfos, res.data.convertedFile]);
    }).catch(error => {
      const errorMsg = error.response?.data?.error || 'Could not upload the file!';
      setMessage({ text: errorMsg, severity: 'error' });
      console.log(error);
      setProgress(0);
      setCurrentFile(undefined);
    });
  };

  const onDrop = (files) => {
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  return (
    <Box className="container text-center my-5 w-50">
      {currentFile && (
        <Box className="progress mb-3">
          <LinearProgress variant="determinate" value={progress} />
          <Box className="progress-label">{progress}%</Box>
        </Box>
      )}

      <Dropzone onDrop={onDrop} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <Box {...getRootProps()} className={styles.dropzone} sx={{ padding: '20px', border: '2px dashed #ccc', borderRadius: '4px', cursor: 'pointer' }}>
              <input {...getInputProps()} />
              {selectedFiles && selectedFiles[0].name ? (
                <Box className={styles.selected_file}>
                  {selectedFiles[0].name}
                </Box>
              ) : (
                'Drag and drop file here, or click to select file'
              )}
            </Box>
            <aside className={styles.selected_file_wrapper} sx={{ marginTop: '20px' }}>
              <Button variant="contained" color="success" disabled={!selectedFiles} onClick={upload}>
                Convert
              </Button>
            </aside>
          </section>
        )}
      </Dropzone>

      {message.text && (
        <Alert severity={message.severity} sx={{ marginTop: '20px' }}>
          {message.text}
        </Alert>
      )}

      {fileInfos.length > 0 && (
        <Card sx={{ marginTop: '20px' }}>
          <CardHeader title="List of Files" />
          <List>
            {fileInfos.map((file, index) => (
              <ListItem key={index}>
                <a href={file.url}>{file.name}</a>
                <a href={file}>{file}</a> 
              </ListItem>
            ))}
          </List>
        </Card>
      )}
      <p>new</p>

      {fileInfos.length > 0 && (
        <Card sx={{ marginTop: '20px' }}>
          <CardHeader title="List of Files" />
          <List>
            {fileInfos.map((file, index) => (
              <ListItem key={index}>
                <a href={file} target="_blank" rel="noopener noreferrer">Download Converted File</a>
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
};

export default DragNDropUpload;

