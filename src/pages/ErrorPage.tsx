import { useRouteError } from 'react-router-dom';
import { Typography } from '@mui/material';
import DefaultLayout from '../ui/layout/DefaultLayout';

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <DefaultLayout>
      <div
        id="error-page"
        className="flex flex-col items-center text-bluegrey-500"
      >
        <Typography variant="h2" fontWeight="500">
          Oops!
        </Typography>
        <Typography variant="body1">
          Sorry, an unexpected error has occurred.
        </Typography>
        <Typography variant="caption">
          {error.statusText || error.message}
        </Typography>
      </div>
    </DefaultLayout>
  );
}
