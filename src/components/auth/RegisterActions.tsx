import { Button } from '@pradnyakuswara/ui';
import GoogleIcon, { googleOAuthUrl } from './GoogleIcon';

export default function RegisterActions() {
  return (
    <Button
      type="button"
      fullWidth
      size="lg"
      leftIcon={<GoogleIcon mono />}
      onClick={() => (window.location.href = googleOAuthUrl())}
    >
      Daftar dengan Google
    </Button>
  );
}
