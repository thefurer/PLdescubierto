
import { useState } from "react";
import { X, Check, Palette, Bookmark, Upload, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type CustomizationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CustomizationModal = ({ isOpen, onClose }: CustomizationModalProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [primaryColor, setPrimaryColor] = useState<string>("ocean");
  
  const colorOptions = [
    { name: "Ocean Blue", value: "ocean" },
    { name: "Tropical Green", value: "tropical" },
    { name: "Sunset Orange", value: "sunset" },
    { name: "Coral Red", value: "coral" },
    { name: "Sandy Beige", value: "sand" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className={cn(
          "w-full max-w-md rounded-2xl shadow-2xl animate-scale-in",
          theme === "light" ? "bg-white" : "bg-gray-900"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className={cn(
            "text-xl font-bold",
            theme === "light" ? "text-ocean-dark" : "text-white"
          )}>
            Customize Your Experience
          </h3>
          <button 
            onClick={onClose}
            className={cn(
              "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              theme === "light" ? "text-gray-600" : "text-gray-300"
            )}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          {/* Theme Selection */}
          <div>
            <h4 className={cn(
              "text-lg font-semibold mb-3",
              theme === "light" ? "text-gray-800" : "text-white"
            )}>
              Theme
            </h4>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-all",
                  theme === "light" 
                    ? "border-ocean bg-ocean-light/30 text-ocean-dark" 
                    : "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                <Sun size={24} />
                <span>Light</span>
                {theme === "light" && <Check size={16} className="text-ocean" />}
              </button>
              
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-all",
                  theme === "dark" 
                    ? "border-blue-500 bg-blue-900/30 text-blue-100" 
                    : "border-gray-300 bg-gray-800 text-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                )}
              >
                <Moon size={24} />
                <span>Dark</span>
                {theme === "dark" && <Check size={16} className="text-blue-400" />}
              </button>
            </div>
          </div>
          
          {/* Color Options */}
          <div>
            <h4 className={cn(
              "text-lg font-semibold mb-3",
              theme === "light" ? "text-gray-800" : "text-white"
            )}>
              Color Scheme
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setPrimaryColor(color.value)}
                  className={cn(
                    "p-3 rounded-lg border flex items-center gap-3 transition-all",
                    primaryColor === color.value
                      ? theme === "light" 
                        ? "border-ocean bg-ocean-light/30" 
                        : "border-blue-500 bg-blue-900/30"
                      : theme === "light"
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-gray-700 hover:border-gray-600"
                  )}
                >
                  <div className={`w-6 h-6 rounded-full bg-${color.value}`} />
                  <span className={theme === "light" ? "text-gray-800" : "text-gray-200"}>
                    {color.name}
                  </span>
                  {primaryColor === color.value && (
                    <Check size={16} className={theme === "light" ? "text-ocean ml-auto" : "text-blue-400 ml-auto"} />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Additional Options */}
          <div>
            <h4 className={cn(
              "text-lg font-semibold mb-3",
              theme === "light" ? "text-gray-800" : "text-white"
            )}>
              More Options
            </h4>
            <div className="space-y-3">
              <button
                className={cn(
                  "w-full p-3 rounded-lg border flex items-center gap-3 transition-all",
                  theme === "light" 
                    ? "border-gray-200 hover:border-gray-300 text-gray-800" 
                    : "border-gray-700 hover:border-gray-600 text-gray-200"
                )}
              >
                <Bookmark size={18} className={theme === "light" ? "text-coral" : "text-coral"} />
                <span>Save Favorite Attractions</span>
              </button>
              
              <button
                className={cn(
                  "w-full p-3 rounded-lg border flex items-center gap-3 transition-all",
                  theme === "light" 
                    ? "border-gray-200 hover:border-gray-300 text-gray-800" 
                    : "border-gray-700 hover:border-gray-600 text-gray-200"
                )}
              >
                <Palette size={18} className={theme === "light" ? "text-green-600" : "text-green-400"} />
                <span>Customize Interface</span>
              </button>
              
              <button
                className={cn(
                  "w-full p-3 rounded-lg border flex items-center gap-3 transition-all",
                  theme === "light" 
                    ? "border-gray-200 hover:border-gray-300 text-gray-800" 
                    : "border-gray-700 hover:border-gray-600 text-gray-200"
                )}
              >
                <Upload size={18} className={theme === "light" ? "text-amber-600" : "text-amber-400"} />
                <span>Upload Profile Picture</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors",
              theme === "light" 
                ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                : "border-gray-700 text-gray-300 hover:bg-gray-800"
            )}
          >
            Cancel
          </button>
          
          <button
            onClick={onClose}
            className={cn(
              "px-4 py-2 rounded-lg transition-colors",
              theme === "light" 
                ? "bg-ocean text-white hover:bg-ocean-dark" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
