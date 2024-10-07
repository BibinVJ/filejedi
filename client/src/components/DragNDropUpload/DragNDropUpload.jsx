import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import styles from './DragNDropUpload.module.css';
import axios from 'axios';
import JSZip from 'jszip';

import { Box, Button, LinearProgress, Alert, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import ArchiveIcon from '@mui/icons-material/Archive';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const DragNDropUpload = ({ fromFormat, toFormat }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ text: '', severity: '' });

  const upload = () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('fromFormat', fromFormat);
    formData.append('toFormat', toFormat);

    setProgress(0);
    axios.post("http://localhost:5000/api/convert", formData, {
      onUploadProgress: (event) => {
        const progressPercent = Math.round((100 * event.loaded) / event.total);
        setProgress(progressPercent);
      }
    }).then(res => {
      setMessage({ text: 'Files converted successfully.', severity: 'success' });
      setConvertedFiles(prevFiles => [...prevFiles, ...res.data.convertedFiles]); // Append new converted files
    }).catch(error => {
      const errorMsg = error.response?.data?.error || 'Could not upload the file!';
      setMessage({ text: errorMsg, severity: 'error' });
      setProgress(0);
    });
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const onDrop = (files) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const download = (fileUrl, fileName) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  const downloadAllAsZip = () => {
    const zip = new JSZip();
    const downloadPromises = convertedFiles.map(({ convertedFileUrl, convertedFileName }) =>
      fetch(convertedFileUrl)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(convertedFileName, blob);
        })
    );

    Promise.all(downloadPromises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "converted_files.zip");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
    });
  };

  return (
    <Box className={styles.container}>
      {/* File Preview List */}
      {selectedFiles.length > 0 && selectedFiles.map((file, index) => {
        const convertedFile = convertedFiles.find(f => f.originalFileName === file.name);

        return (
          <Box key={index} className={styles.selected_file}>
            <div className={styles.file_name}>
              <ImageIcon className={styles.file_icon} />
              {file.name.length > 40 ? `${file.name.substring(0, 30)}...${file.name.slice(-10)}` : file.name}
            </div>

            <div className={styles.file_size}>
              {file.size > 1024 ? (file.size / 1024).toFixed(2) + ' MB' : file.size + ' KB'}
            </div>

            <div className={styles.file_actions}>
              {!convertedFile ? (
                <IconButton onClick={() => removeFile(index)}>
                  <ClearIcon />
                </IconButton>
              ) : (
                <IconButton onClick={() => download(convertedFile.convertedFileUrl, convertedFile.convertedFileName)}>
                  <DownloadIcon />
                </IconButton>
              )}
            </div>
          </Box>
        );
      })}

      {/* Dropzone */}
      <div className={selectedFiles.length ? styles.dropzone_shrinked : styles.dropzone}>
        <Dropzone onDrop={onDrop} multiple={true}>
          {({ getRootProps, getInputProps }) => (
            <section className={selectedFiles.length ? styles.dropzone_box_shrinked : styles.dropzone_box}>
              <Box {...getRootProps()}>
                <input {...getInputProps()} />
                Drag and drop files here, or click to select files
              </Box>
            </section>
          )}
        </Dropzone>

        {selectedFiles.length > 0 && !convertedFiles.length ? (
          <Button className={styles.convert_button} variant="contained" color="info" onClick={upload}>
            <div>
              Convert All
            </div>
            <ChevronRightIcon />
          </Button>
        ) : (
          convertedFiles.length > 0 && (
            <Button className={styles.convert_button} variant="contained" color="success" onClick={downloadAllAsZip}>
              <div>
                Download All as Zip
              </div>
              <ArchiveIcon />
            </Button>
          )
        )}
      </div>

      {/* Progress and Alerts */}
      {(progress > 0 && progress < 100) && (
        <Box className={styles.progress}>
          <LinearProgress variant="determinate" value={progress} className={styles.progress_bar} />
          <Box className={styles.progress_label}>{progress}%</Box>
        </Box>
      )}

      {message.text && (
        <Alert severity={message.severity} className={styles.alert}>
          {message.text}
        </Alert>
      )}
    </Box>
  );
};

export default DragNDropUpload;
