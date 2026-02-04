import {Pagination} from '@shopify/hydrogen';

export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: any;
  children: (args: {node: NodesType; index: number}) => React.ReactNode;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesToDisplay = nodes;

        return (
          <div className="space-y-8">
            {/* Previous Button */}
            <div className="flex justify-center">
              <PreviousLink className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Loading...' : 'Load previous'}
              </PreviousLink>
            </div>

            {/* Products Grid */}
            <div className={resourcesClassName}>
              {resourcesToDisplay.map((node: NodesType, index: number) =>
                children({node, index}),
              )}
            </div>

            {/* Next/Load More Button */}
            <div className="flex justify-center">
              <NextLink className="inline-flex items-center justify-center px-8 py-3 bg-[#2092bb] hover:bg-[#1a7aa0] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Loading...' : 'Load more'}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}