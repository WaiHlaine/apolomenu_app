import { Circle } from 'lucide-react';
import { Input } from './ui/input';

export default function ImageUpload({ onSelect, value }: { onSelect: (value?: File) => void; value?: File }) {
    console.log({ value });
    const handleImageSlectButtonClick = () => {
        const input = document.getElementById('image') as HTMLInputElement;
        input.click();
    };
    console.log('rendering image upload...');
    return (
        <div>
            <Input className="hidden" id="image" type="file" accept="image/*" onChange={(e) => onSelect(e.target.files?.[0])} />

            {value ? (
                <div onClick={handleImageSlectButtonClick} className="flex items-center justify-center">
                    <img src={URL.createObjectURL(value)} alt="Preview" className="h-[220px] w-[220px] rounded-lg object-cover" />
                </div>
            ) : (
                <div>
                    <div className="flex h-[220px] flex-col items-center justify-center gap-2.5 rounded-md border border-dotted p-2.5">
                        <p className="text-sm font-semibold">Drop your image here</p>
                        <p className="text-sm">PNG or JPG ( 1200px * 1200px )</p>
                        <div className="flex items-center gap-2 rounded-sm bg-gray-100 p-2" onClick={handleImageSlectButtonClick}>
                            <Circle size={16} />
                            <span className="text-sm">Select photo</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
