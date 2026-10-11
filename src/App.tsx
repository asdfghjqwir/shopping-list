import { useEffect, useState, type FormEvent } from 'react';

// 買うもの1件の形
interface Item {
  id: number;
  name: string;
  checked: boolean;
}

export default function App() {
  // 保存されたデータがあれば読み込む（文字列 → 配列）
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('items');
    return saved ? JSON.parse(saved) : [];
  });
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // items が変わるたびに保存する（配列 → 文字列）
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  // 追加
  const addItem = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim() === '') {
      setError('買うものを入力してください');
      return;
    }
    setItems([...items, { id: Date.now(), name: name.trim(), checked: false }]);
    setName('');
  };

  // チェックのオン・オフ
  const toggleItem = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  // 削除
  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-900">
      <main className="mx-auto max-w-md">
        <p className="text-xs tracking-[0.3em] text-stone-600">SHOPPING LIST</p>
        <h1 className="mt-2 mb-10 text-3xl font-light tracking-wide">買い物リスト</h1>

        <form onSubmit={addItem} className="flex items-end gap-4">
          <label htmlFor="new-item" className="sr-only">
            買うものを入力
          </label>
          <input
            id="new-item"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(''); // 入力し直したらエラー文を消す
            }}
            placeholder="買うものを入力"
            className="flex-1 border-b border-stone-400 bg-transparent py-2 placeholder:text-stone-500"
          />
          <button className="rounded-full bg-stone-900 px-6 py-2 text-sm text-white hover:bg-stone-700">
            追加
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

        <ul className="mt-8 divide-y divide-stone-200 border-t border-stone-300">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <input
                type="checkbox"
                id={`item-${item.id}`}
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
                className="size-5 accent-stone-900"
              />
              <label
                htmlFor={`item-${item.id}`}
                className={`flex-1 ${item.checked ? 'text-stone-500 line-through' : ''}`}
              >
                {item.name}
              </label>
              <button
                onClick={() => deleteItem(item.id)}
                aria-label={`${item.name}を削除`}
                className="text-sm text-stone-600 hover:text-red-700"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}