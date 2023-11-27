import { Category } from '../domain/entity/Category';

interface Props {
  category: Category;
}

interface CategoryPresenter {
  shortName: string;
  name: string;
  description: string;
}

function DisplayCategory({ category }: Props) {
  const descriptions: Map<Category, CategoryPresenter> = new Map([
    [
      Category.X,
      {
        shortName: 'X',
        name: 'X',
        description:
          'Impacts from use phase (related to operating energy and movement) are not predominant. Manufacturing process alternatives may be for instance relevant to decrease the impacts. Yet it does not mean that the use phase must be neglected of forgotten. It simply means\n' +
          'environmental facts do not justify a priority action on those items',
      },
    ],
    [
      Category.E,
      {
        shortName: 'E',
        name: 'Energy',
        description:
          'Impacts of operating energy (i.e. caused by its production in power plants) consumed by the equipment prevail over the other life cycle aspects (e.g. manufacturing impacts).',
      },
    ],
    [
      Category.EM,
      {
        shortName: 'EM',
        name: 'Energy & Material/Movement',
        description:
          'Impacts from both operating energy and movement are important. Both aspects from the use phase are to be considered in priority.',
      },
    ],
    [
      Category.M,
      {
        shortName: 'M',
        name: 'Material/Movement',
        description:
          'Impacts of the product movement in use (i.e. caused by vehicles) along the whole life cycle overcome other all sources of impacts including the operating energy in use.',
      },
    ],
    [
      Category.NONE,
      {
        shortName: 'N/A',
        name: 'Not applicable',
        description: 'Cannot determine impact category based on current data.',
      },
    ],
  ]);

  return (
    <div className="flex mt-2">
      <div className="flex flex-col">
        <div className="flex h-full justify-center items-center mt-1">
          <div className="qtm-title-1">
            {descriptions.get(category)?.shortName}
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-6">
        <div className="mt-2 flex qtm-body-2">
          {descriptions.get(category)?.description}
        </div>
      </div>
    </div>
  );
}

export default DisplayCategory;
