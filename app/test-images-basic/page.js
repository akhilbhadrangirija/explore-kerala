export default function TestImagesBasic() {
  const images = [
    { src: '/backwaters.jpg', name: 'Backwaters' },
    { src: '/munnar.jpg', name: 'Munnar' },
    { src: '/kovalam.jpg', name: 'Kovalam' },
    { src: '/alapuzha.jpg', name: 'Alappuzha' },
    { src: '/athirapilly.jpg', name: 'Athirappilly' }
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Accessibility Test</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={image.src}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log(`✅ ${image.name} loaded successfully`)}
                  onError={(e) => console.error(`❌ ${image.name} failed to load:`, e)}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{image.name}</h3>
                <p className="text-sm text-gray-600">{image.src}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Test Results:</h2>
          <p className="text-sm text-gray-700 mb-2">
            Check the browser console (F12 → Console) for load/error messages.
          </p>
          <p className="text-sm text-gray-700">
            If you see ✅ messages, images are loading correctly. If you see ❌ messages, there's a path or access issue.
          </p>
        </div>
      </div>
    </div>
  );
}
