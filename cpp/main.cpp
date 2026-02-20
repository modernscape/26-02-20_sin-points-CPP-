#include <emscripten/bind.h>
#include <cmath>
#include <vector>

class SineWaveSim {
private:
    int numPoints;
    std::vector<float> positions; // [x0, y0, z0, x1, y1, z1, ...]
    float time = 0.0f;

public:
    SineWaveSim(int n) : numPoints(n) {
        positions.resize(n * 3);
        for (int i = 0; i < n; i++) {
            // (i - n/2) にすることで、中心が 0 になります
            positions[i * 3 + 0] = (float)(i - n / 2.0f) * 0.1f; 
            positions[i * 3 + 1] = 0.0f;
            positions[i * 3 + 2] = 0.0f;
        }
    }

    void update(float dt) {
        time += dt;
        int side = std::sqrt(numPoints); // 正方形に並べる場合
        for (int i = 0; i < numPoints; i++) {
            int ix = i % side;
            int iz = i / side;
            
            float x = (ix - side / 2.0f) * 0.5f;
            float z = (iz - side / 2.0f) * 0.5f;
            
            positions[i * 3 + 0] = x;
            // XとZの両方を使って複雑な波を作る
            positions[i * 3 + 1] = std::sin(x + time) * std::cos(z + time);
            positions[i * 3 + 2] = z;
        }
    }

    // JS側からメモリを覗くためのポインタ取得
    uintptr_t getPositionPointer() const {
        return reinterpret_cast<uintptr_t>(positions.data());
    }
};

using namespace emscripten;
EMSCRIPTEN_BINDINGS(my_module) {
    class_<SineWaveSim>("SineWaveSim")
        .constructor<int>()
        .function("update", &SineWaveSim::update)
        .function("getPositionPointer", &SineWaveSim::getPositionPointer);
}