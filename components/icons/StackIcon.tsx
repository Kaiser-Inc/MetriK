import type { Stack } from "@/types/metrics";

interface StackIconProps {
  stack: Stack;
  size?: number;
  className?: string;
  fill?: string;
}


function PythonIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 255" xmlns="http://www.w3.org/2000/svg" aria-label="Python">
      <defs>
        <linearGradient id="py-a" x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%">
          <stop offset="0%" stopColor="#387EB8" />
          <stop offset="100%" stopColor="#366994" />
        </linearGradient>
        <linearGradient id="py-b" x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%">
          <stop offset="0%" stopColor="#FFE052" />
          <stop offset="100%" stopColor="#FFC331" />
        </linearGradient>
      </defs>
      <path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.97c0 65.615 36.327 63.317 36.327 63.317h21.704v-30.438s-1.171-36.327 35.755-36.327h61.58s34.601.557 34.601-33.456V33.713S195.37.072 126.916.072zm-34.23 19.574a11.079 11.079 0 0 1 11.128 11.13 11.079 11.079 0 0 1-11.128 11.127 11.079 11.079 0 0 1-11.13-11.127 11.079 11.079 0 0 1 11.13-11.13z" fill="url(#py-a)" />
      <path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.91c0-65.615-36.327-63.317-36.327-63.317h-21.704v30.438s1.171 36.327-35.755 36.327h-61.58s-34.601-.557-34.601 33.456v56.35s-5.247 33.643 63.197 33.643zm34.23-19.574a11.079 11.079 0 0 1-11.128-11.13 11.079 11.079 0 0 1 11.128-11.127 11.079 11.079 0 0 1 11.13 11.127 11.079 11.079 0 0 1-11.13 11.13z" fill="url(#py-b)" />
    </svg>
  );
}

function NodeIcon({ size }: { size: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icons/node.svg" width={size} height={size} alt="Node.js" style={{ display: "block" }} />;
}

function RubyIcon({ size }: { size: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icons/ruby.svg" width={size} height={size} alt="Ruby" style={{ display: "block" }} />;
}

export function StackIcon({ stack, size = 16, className }: StackIconProps) {
  const icons: Record<Stack, React.ReactNode> = {
    'python-fastapi': <PythonIcon size={size} />,
    'node-fastify':   <NodeIcon size={size} />,
    'ruby-on-rails':  <RubyIcon size={size} />,
  };

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
      {icons[stack]}
    </span>
  );
}
