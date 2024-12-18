import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImage } from '../services/fileService';

export const uploadFile = createAsyncThunk('file/uploadFile', async ({ file, token }: { file: File; token: string }) => {
  return await uploadImage(file, token);
});

const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState: { uploading: false, fileUrl: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.fileUrl = action.payload.url;
    });
  },
});

export default fileUploadSlice.reducer;
