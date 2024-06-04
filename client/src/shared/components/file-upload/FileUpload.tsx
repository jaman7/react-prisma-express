import { FileUpload } from 'primereact/fileupload';
import { IFileUpload } from './file-upload.model';
import { FormikProps } from 'formik';

interface IProps {
  config?: Partial<IFileUpload>;
  formik?: FormikProps<any>;
  [name: string]: any;
}

const FileUploadField = (props: IProps) => {
  return (
    <>{/* <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}</>
  );
};

export default FileUploadField;
