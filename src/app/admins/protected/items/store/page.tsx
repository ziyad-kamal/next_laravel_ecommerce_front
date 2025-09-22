"use client";

import React, {
    ChangeEvent,
    FormEvent,
    useRef,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import sendRequest from "@/functions/sendRequest";
import { display } from "@/redux/DisplayToast";
import { Button, Card, Dropdown, Dropzone, Input } from "@/components";
import { languages } from "@/constants";
import InitialErrors from "@/interfaces/states/InitialErrors";
import type { SuggestionItem } from "@/interfaces/states/SuggestionItem";

export interface ItemType {
    name: string;
    trans_lang: string;
    condition: string;
    price: number;
    description: string;
    category: string;
    brand: string;
}

const initialErrors: InitialErrors = {};

const StoreCategory = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState<InitialErrors>(initialErrors);
    const router = useRouter();
    const abortController = useRef<AbortController | null>(null);

    // Initialize inputs with items array for each language
    const [inputs, setInputs] = useState<{
        items: Array<ItemType>;
        images: string[];
    }>({
        items: languages().map(
            (lang): ItemType => ({
                name: "",
                trans_lang: lang.abbre,
                condition: "",
                price: 0,
                description: "",
                category: "",
                brand: "",
            })
        ),
        images: [],
    });

    // New states for dropdown visibility and filtered results
    const [showCategoryDropdown, setShowCategoryDropdown] = useState<{
        [key: number]: boolean;
    }>({});
    const [showBrandDropdown, setShowBrandDropdown] = useState<{
        [key: number]: boolean;
    }>({});
    const [filteredCategories, setFilteredCategories] = useState<
        SuggestionItem[]
    >([]);
    const [filteredBrands, setFilteredBrands] = useState<SuggestionItem[]>([]);

    // Refs for click outside detection
    const categoryDropdownRefs = useRef<{
        [key: number]: HTMLDivElement | null;
    }>({});
    const brandDropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>(
        {}
    );

    // Fetch functions wrapped in useCallback
    const fetchCategories = useCallback(
        async (searchTerm: string, abortController: AbortController | null) => {
            const url = `/admin-panel/search/items${
                searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""
            }`;
            const token = localStorage.getItem("adminToken");

            const response = await sendRequest(
                "get",
                url,
                null,
                abortController,
                token,
                router
            );

            if (response && response.success) {
                setFilteredCategories(response.data.data);
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        },
        [dispatch, router]
    );

    // Use debounced search functions
    const handleCategorySearch = useCallback(
        async (...args: unknown[]) => {
            const [searchTerm, langIndex, abortController] = args as [
                string,
                number,
                AbortController | null
            ];
            if (searchTerm.trim()) {
                await fetchCategories(searchTerm, abortController);
            } else {
                setFilteredCategories([]);
                setShowCategoryDropdown((prev) => ({
                    ...prev,
                    [langIndex]: false,
                }));
            }
        },
        [fetchCategories, setFilteredCategories]
    );

    // Function to fetch brands with search term
    const fetchBrands = useCallback(
        async (searchTerm: string, abortController: AbortController | null) => {
            const url = `/admin-panel/search/brands${
                searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""
            }`;
            const token = localStorage.getItem("adminToken");

            const response = await sendRequest(
                "get",
                url,
                null,
                abortController,
                token,
                router
            );

            if (response && response.success) {
                setFilteredBrands(response.data.data);
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        },
        [dispatch, router]
    );

    const handleBrandSearch = useCallback(
        async (...args: unknown[]) => {
            const [searchTerm, langIndex, abortController] = args as [
                string,
                number,
                AbortController | null
            ];
            if (searchTerm.trim()) {
                await fetchBrands(searchTerm, abortController);
            } else {
                setFilteredBrands([]);
                setShowBrandDropdown((prev) => ({
                    ...prev,
                    [langIndex]: false,
                }));
            }
        },
        [fetchBrands, setFilteredBrands]
    );

    const { debouncedFn: debouncedCategorySearch } = useDebounce(
        handleCategorySearch,
        { delay: 700 }
    );
    const { debouncedFn: debouncedBrandSearch } = useDebounce(
        handleBrandSearch,
        { delay: 700 }
    );

    // Click outside effect
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check category dropdowns
            Object.keys(categoryDropdownRefs.current).forEach((key) => {
                const langIndex = parseInt(key);
                const ref = categoryDropdownRefs.current[langIndex];
                if (ref && !ref.contains(target)) {
                    setShowCategoryDropdown((prev) => ({
                        ...prev,
                        [langIndex]: false,
                    }));
                }
            });

            // Check brand dropdowns
            Object.keys(brandDropdownRefs.current).forEach((key) => {
                const langIndex = parseInt(key);
                const ref = brandDropdownRefs.current[langIndex];
                if (ref && !ref.contains(target)) {
                    setShowBrandDropdown((prev) => ({
                        ...prev,
                        [langIndex]: false,
                    }));
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // MARK: handleChange
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        langIndex: number
    ) => {
        const value = e.target.value;
        const name = e.target.name;

        // Update the input value
        setInputs((prevInputs) => ({
            ...prevInputs,
            items: prevInputs.items.map((item, index) =>
                index === langIndex ? { ...item, [name]: value } : item
            ),
        }));

        if (name === "category") {
            // Show dropdown for this language index
            setShowCategoryDropdown((prev) => ({ ...prev, [langIndex]: true }));

            // Trigger debounced search
            debouncedCategorySearch(value, langIndex, null);
        }

        if (name === "brand") {
            // Show dropdown for this language index
            setShowBrandDropdown((prev) => ({ ...prev, [langIndex]: true }));

            // Trigger debounced search
            debouncedBrandSearch(value, langIndex, null);
        }
    };

    // Handle selection from dropdown
    const handleCategorySelect = (
        category: SuggestionItem,
        langIndex: number
    ) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            items: prevInputs.items.map((item, index) =>
                index === langIndex
                    ? {
                          ...item,
                          category: category.name || "",
                      }
                    : item
            ),
        }));
        setShowCategoryDropdown((prev) => ({ ...prev, [langIndex]: false }));
    };

    const handleBrandSelect = (brand: SuggestionItem, langIndex: number) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            items: prevInputs.items.map((item, index) =>
                index === langIndex
                    ? { ...item, brand: brand.name || "" }
                    : item
            ),
        }));
        setShowBrandDropdown((prev) => ({ ...prev, [langIndex]: false }));
    };

    // MARK: handleSubmit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const token = localStorage.getItem("adminToken");
        const url = `/admin-panel/category`;

        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        const submitData = async () => {
            const response = await sendRequest(
                "post",
                url,
                inputs,
                abortController.current,
                token,
                router
            );
            setErrors(initialErrors);

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );

                setIsLoading(false);
                setInputs({
                    items: languages().map((lang) => ({
                        name: "",
                        trans_lang: lang.abbre,
                        condition: "",
                        price: 0,
                        description: "",
                        category: "",
                        brand: "",
                    })),
                    images: [],
                });
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
                setIsLoading(false);

                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        };

        submitData();
    };

    return (
        <div>
            <div className="flex flex-col justify-center items-center h-100 mt-300">
                <Dropzone<ItemType>
                    setInputs={setInputs}
                    className="p-16 mt-10 border border-neutral-200 rounded-2xl bg-gray-200"
                />
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                >
                    {languages().map((lang, i) => (
                        <Card key={i}>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Add Category
                                </h1>
                                <span>{`(in ${lang.name})`}</span>
                            </div>

                            <div className="mb-4">
                                <Input
                                    label={`name`}
                                    name={`name`}
                                    type="text"
                                    handleChange={(e) =>
                                        handleInputChange(e, i)
                                    }
                                    classes="text-black 
                                            border-gray-300 
                                            focus:ring-indigo-500 
                                            bg-white/50"
                                    error={
                                        errors[`items.${i}.name`]
                                            ? errors[`items.${i}.name`][0]
                                            : ""
                                    }
                                    value={inputs.items[i]?.name || ""}
                                />

                                {/* Category input with dropdown */}
                                <div className="relative">
                                    <Input
                                        label={`Category`}
                                        name={`category`}
                                        type="text"
                                        handleChange={(e) =>
                                            handleInputChange(e, i)
                                        }
                                        classes="text-black 
                                                border-gray-300 
                                                focus:ring-indigo-500 
                                                bg-white/50"
                                        error={
                                            errors[`items.${i}.category`]
                                                ? errors[
                                                      `items.${i}.category`
                                                  ][0]
                                                : ""
                                        }
                                        value={inputs.items[i]?.category || ""}
                                    />
                                    <Dropdown
                                        items={filteredCategories}
                                        onSelect={(category: SuggestionItem) =>
                                            handleCategorySelect(category, i)
                                        }
                                        show={showCategoryDropdown[i] || false}
                                        langIndex={i}
                                        type="category"
                                        ref={categoryDropdownRefs}
                                    />
                                </div>

                                {/* Brand input with dropdown */}
                                <div className="relative">
                                    <Input
                                        label={`brand`}
                                        name={`brand`}
                                        type="text"
                                        handleChange={(e) =>
                                            handleInputChange(e, i)
                                        }
                                        classes="text-black 
                                                border-gray-300 
                                                focus:ring-indigo-500 
                                                bg-white/50"
                                        error={
                                            errors[`items.${i}.brand`]
                                                ? errors[`items.${i}.brand`][0]
                                                : ""
                                        }
                                        value={inputs.items[i]?.brand || ""}
                                    />
                                    <Dropdown
                                        items={filteredBrands}
                                        onSelect={(brand) =>
                                            handleBrandSelect(brand, i)
                                        }
                                        show={showBrandDropdown[i] || false}
                                        langIndex={i}
                                        type="brand"
                                        ref={brandDropdownRefs}
                                    />
                                </div>

                                <Input
                                    label={`price`}
                                    name={`price`}
                                    type="number"
                                    handleChange={(e) =>
                                        handleInputChange(e, i)
                                    }
                                    classes="text-black 
                                            border-gray-300 
                                            focus:ring-indigo-500 
                                            bg-white/50"
                                    error={
                                        errors[`items.${i}.price`]
                                            ? errors[`items.${i}.price`][0]
                                            : ""
                                    }
                                    value={inputs.items[i]?.price || ""}
                                />

                                <Input
                                    label={`condition`}
                                    name={`condition`}
                                    type="text"
                                    handleChange={(e) =>
                                        handleInputChange(e, i)
                                    }
                                    classes="text-black 
                                            border-gray-300 
                                            focus:ring-indigo-500 
                                            bg-white/50"
                                    error={
                                        errors[`items.${i}.condition`]
                                            ? errors[`items.${i}.condition`][0]
                                            : ""
                                    }
                                    value={inputs.items[i]?.condition || ""}
                                />

                                <Input
                                    label={`description`}
                                    name={`description`}
                                    type="text"
                                    handleChange={(e) =>
                                        handleInputChange(e, i)
                                    }
                                    classes="text-black 
                                            border-gray-300 
                                            focus:ring-indigo-500 
                                            bg-white/50"
                                    error={
                                        errors[`items.${i}.description`]
                                            ? errors[
                                                  `items.${i}.description`
                                              ][0]
                                            : ""
                                    }
                                    value={inputs.items[i]?.description || ""}
                                />
                            </div>
                        </Card>
                    ))}

                    <Button
                        isLoading={isLoading}
                        text="add"
                        classes="bg-indigo-700 hover:bg-indigo-800 w-full flex justify-center my-5"
                    ></Button>
                </form>
            </div>
        </div>
    );
};

export default StoreCategory;
