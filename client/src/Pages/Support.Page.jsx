import { icons } from '../Assets/icons';
import { CONTRIBUTORS } from '../Constants/constants';
import { ContributorCard } from '../Components';

export default function SupportPage() {
    const contributorElements = CONTRIBUTORS?.map((contributor) => (
        <ContributorCard key={contributor.name} contributor={contributor} />
    ));

    return (
        <div className="h-full w-full text-black flex flex-col justify-start items-center gap-6">
            <div className="flex items-center justify-center flex-col gap-4">
                <div className="bg-[#ffffff] rounded-full overflow-hidden drop-shadow-md hover:brightness-105 w-fit">
                    <div className="size-[95px] fill-[#3a67d8] ">
                        {icons.support}
                    </div>
                </div>

                <h1 className="w-full font-bold text-center mb-6 text-3xl">
                    Connect for any Issue or Support
                </h1>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-10 w-full">
                {contributorElements}
            </div>
        </div>
    );
}
