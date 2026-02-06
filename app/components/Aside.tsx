import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {createPortal} from 'react-dom';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};
type AsideProps = {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
};
/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({ children, heading, type }: AsideProps) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
     const abortController = new AbortController();

    if (expanded) {
      // Prevent scrolling the main page when cart is open
      document.body.style.overflow = 'hidden'; 
      
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => {
      abortController.abort();
      document.body.style.overflow = ''; // Cleanup scroll lock
    };
  }, [close, expanded]);

  // If we aren't mounted yet (Server Side), render nothing or a hidden div
  if (!mounted || typeof document === 'undefined') return null;

  // 3. Wrap everything in createPortal to document.body
  return createPortal(
    <div 
      aria-modal 
      className={`overlay ${expanded ? 'expanded' : ''}`} 
      role="dialog"
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 9999, // Force it to the front
        display: expanded ? 'block' : 'none' // Ensure it only exists when expanded
      }}
    >
      <button className="close-outside" onClick={close} />
      <aside style={{ zIndex: 10000 }}> 
        <header>
          <h3>{heading}</h3>
          <button className="close reset" onClick={close}>&times;</button>
        </header>
        <main>{children}</main>
      </aside>
    </div>,
    document.body
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
