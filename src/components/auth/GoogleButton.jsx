import Button from "./Button";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5 16.5 35.5 10.5 29.5 10.5 22S16.5 8.5 24 8.5c3.6 0 6.9 1.3 9.4 3.6l5.7-5.7C35.6 3 30.1 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c11 0 21-8 21-22 0-1.5-.2-2.9-.4-2.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 15.3 18.9 12.5 24 12.5c3.6 0 6.9 1.3 9.4 3.6l5.7-5.7C35.6 7 30.1 5 24 5c-7.5 0-14 4.2-17.7 9.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 43c5.9 0 11.3-2.3 15.3-6.1l-6.3-5.4C30.7 33.4 27.5 34.5 24 34.5c-5.2 0-9.6-3.1-11.4-7.6l-6.6 5.1C9.9 38.5 16.4 43 24 43z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-2.7 4.8-5 6.4l6.3 5.4C40.7 36.7 44 30.7 44 23c0-1.5-.2-2.9-.4-2.5z"
    />
  </svg>
);

const GoogleButton = ({ children = "Continue with Google", ...props }) => (
  <Button variant="secondary" icon={<GoogleIcon />} {...props}>
    {children}
  </Button>
);

export default GoogleButton;
