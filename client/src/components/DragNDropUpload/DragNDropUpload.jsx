import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import styles from './DragNDropUpload.module.css';
import axios from 'axios';

import { Box, Button, LinearProgress, Alert } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import FilePreview from '../FilePreview/FilePreview';


const DragNDropUpload = ({ fromFormat, toFormat }) => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ text: '', severity: '' });
  const [fileInfos, setFileInfos] = useState({ url: '', name: '' });

  const upload = () => {
    let currentFile = selectedFiles[0];
    setProgress(0);
    setCurrentFile(currentFile);
    setFileInfos({ url: '', name: '' });

    const formData = new FormData();
    formData.append('file', currentFile);
    formData.append('fromFormat', fromFormat);
    formData.append('toFormat', toFormat);

    axios.post("http://localhost:5000/api/convert", formData, {
      onUploadProgress: (event) => {
        const progressPercent = Math.round((100 * event.loaded) / event.total);
        setProgress(progressPercent);
      }
    }).then(res => {
      setMessage({ text: 'File converted successfully.', severity: 'success' });
      setFileInfos({ url: res.data.convertedFileUrl, name: res.data.convertedFileName });
    }).catch(error => {
      const errorMsg = error.response?.data?.error || 'Could not upload the file!';
      setMessage({ text: errorMsg, severity: 'error' });
      setProgress(0);
      setCurrentFile(undefined);
    });
  };

  const onDrop = (files) => {
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const download = (e) => {
    e.preventDefault();
    fetch(fileInfos.url, {
      method: "GET",
      headers: {}
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileInfos.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box className={styles.container}>

      {selectedFiles && selectedFiles[0].name ? (
        <Box className={styles.selected_files}>
          <div className={styles.selected_file}>
            <div className={styles.file_name}>
              <ImageIcon className={styles.file_icon} />
              {selectedFiles[0].name.length > 30 ? (
                selectedFiles[0].name.substring(0, 30) + '...'
              ) : (
                selectedFiles[0].name
              )}
            </div>

            <div className={styles.file_size}>
              {selectedFiles[0].size}
            </div>

            <div className={styles.file_delete}>
              <ClearIcon />
            </div>
          </div>
        </Box>
      ) : (
        ''
      )}

      <div className={selectedFiles && selectedFiles[0].name ? (
        styles.dropzone_shrinked
      ) : (styles.dropzone)}>
        <Dropzone onDrop={onDrop} multiple={false}>
          {({ getRootProps, getInputProps }) => (
            <section className={styles.dropzone_box}>
              <Box {...getRootProps()} >
                <input {...getInputProps()} />
                {selectedFiles && selectedFiles[0].name ? (
                  'Add more files by drag and drop, or click to select file'
                ) : (
                  'Drag and drop file here, or click to select file'
                )}
              </Box>
            </section>
          )}
        </Dropzone>
        {selectedFiles && selectedFiles[0].name ?
          <Button className={styles.convert_button} variant="contained" color="info" disabled={!selectedFiles} onClick={upload}>
            Convert
          </Button>
          : ''}
      </div>


      {currentFile && (
        <Box className={styles.progress}>
          <LinearProgress
            variant="determinate"
            value={progress}
            className={styles.progress_bar}
          />
          <Box className={styles.progress_label}>{progress}%</Box>
        </Box>
      )}

      {message.text && (
        <Alert severity={message.severity} className={styles.alert}>
          {message.text}
        </Alert>
      )}

      {fileInfos.url && (
        <FilePreview fileInfos={fileInfos} download={download} />
      )}
    </Box>
  );
};

export default DragNDropUpload;
