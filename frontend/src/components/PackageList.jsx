import React from 'react';
import PackageCard from './PackageCard';

const PackageList = ({ packages, onBookPackage }) => {
    return (
        <div className="package-grid">
            {packages.map((pkg, index) => (
                <PackageCard
                    key={index}
                    pkg={pkg}
                    onBook={onBookPackage}
                />
            ))}

            <style jsx>{`
        .package-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 1rem 0;
        }

        @media (max-width: 600px) {
          .package-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default PackageList;
